# `create-expo-module.ts` — Step-by-Step Explanation

This is the main file of the `create-expo-module` CLI tool. It defines the CLI interface, collects user input, downloads the template, renders it, and sets up the final module directory. Everything starts and ends here.

---

## Module-level constants

```ts
const CWD = process.env.INIT_CWD || process.cwd();
```

`yarn run` changes `process.cwd()` to the package root, so `INIT_CWD` (set by yarn to the directory where the user originally ran the command) is preferred. This ensures the module is created where the user actually is.

```ts
const IGNORES_PATHS = ['.DS_Store', 'build', 'node_modules', 'package.json', '.npmignore', '.gitignore'];
```

Files and directories skipped when scanning the template. `package.json` is excluded because the template ships it as `$package.json` — the `$` prefix is a naming convention that signals "this file needs special handling" (the `$` is stripped before rendering).

---

## CLI definition (bottom of the file, runs first)

```ts
const program = new Command();
program
  .arguments('[path]')
  .option('-s, --source <source_dir>', ...)
  .option('--with-readme', ...)
  .option('--with-changelog', ...)
  .option('--no-example', ...)
  .option('--local', ...)
  .option('--name <name>', ...)
  .option('--description <description>', ...)
  .option('--package <package>', ...)
  .option('--author-name <name>', ...)
  .option('--author-email <email>', ...)
  .option('--author-url <url>', ...)
  .option('--repo <url>', ...)
  .action(main);
```

Uses the `commander` library. The optional `[path]` argument sets the target directory name. All `--name`, `--description`, `--package`, `--author-*`, `--repo` options exist to bypass interactive prompts — if provided, the matching prompt is skipped.

A `postAction` hook flushes the telemetry client after `main()` completes.

---

## `main(target, options)` — the orchestrator

This is the single function that runs the entire flow. Called by `commander` when the CLI executes.

### Phase 1: Determine interactivity

```ts
const interactive = isInteractive();
```

`isInteractive()` returns `false` if `CI=1/true` or if stdin is not a TTY. When non-interactive, all prompts are skipped and defaults or CLI flags are used instead.

### Phase 2: Resolve the target directory

```ts
const slug = await askForPackageSlugAsync(target, options.local, options);
const targetDir = options.local
  ? await getCorrectLocalDirectory(target || slug)
  : path.join(CWD, target || slug);
```

The slug (npm package name, e.g. `my-module`) is either prompted or derived from the `[path]` argument. The target directory is then resolved:

- **Remote module:** `CWD/my-module`
- **Local module (`--local`):** walks up the directory tree to find the nearest `package.json`, then resolves to `<project-root>/modules/my-module`

If `--local` is used outside an Expo project (no `package.json` found up the tree), an error is printed and the process exits.

### Phase 3: Prepare the target directory

```ts
await fs.promises.mkdir(targetDir, { recursive: true });
await confirmTargetDirAsync(targetDir, options);
```

The directory is created if it doesn't exist. If it already contains files, the user is asked to confirm continuing (or in non-interactive mode, a warning is printed and execution proceeds automatically).

### Phase 4: Collect substitution data

```ts
const data = await askForSubstitutionDataAsync(slug, options.local, options);
```

Collects all variables needed to render the EJS template. See the [Substitution data](#substitution-data) section below for full details.

### Phase 5: Resolve package manager

```ts
const packageManager = resolvePackageManager();
```

Detects which package manager to use by checking `npm_config_user_agent` (set by yarn/pnpm/bun when they invoke the CLI), then falling back to checking which managers are installed.

### Phase 6: Get the template

```ts
const packagePath = options.source
  ? path.join(CWD, options.source)
  : await downloadPackageAsync(targetDir, options.local);
```

Either uses a local directory supplied via `--source` (useful for development/testing of the template itself), or downloads the template from npm. See [Template download](#template-download) below.

### Phase 7: Log telemetry

```ts
await logEventAsync(eventCreateExpoModule(packageManager, options));
```

Fires an anonymous analytics event recording the package manager used and which flags were passed. This is non-blocking and does not affect the output.

### Phase 8: Render template files

```ts
await createModuleFromTemplate(packagePath, targetDir, data);
```

Iterates over every file in the template and renders it with EJS, writing the output to the target directory. See [Template rendering](#template-rendering) below.

### Phase 9: Install and build (remote modules only)

```ts
await installDependencies(packageManager, targetDir);
await spawnAsync(packageManager, ['run', 'build'], { cwd: targetDir });
```

Skipped for `--local` modules. For remote modules, runs `npm/yarn/pnpm/bun install` then `build` (which compiles TypeScript via `expo-module build`).

### Phase 10: Clean up the template directory

```ts
if (!options.source) {
  await fs.promises.rm(packagePath, { recursive: true, force: true });
}
```

The downloaded tarball was extracted into `targetDir/package/`. That temporary directory is removed. Skipped when using a local `--source` (the source directory is the user's own files).

### Phase 11: Post-render cleanup and optional steps (remote modules only)

Skipped entirely for `--local`. For remote modules:

```ts
if (!options.withReadme)    fs.promises.rm('README.md');
if (!options.withChangelog) fs.promises.rm('CHANGELOG.md');
```

`README.md` and `CHANGELOG.md` are removed unless `--with-readme` / `--with-changelog` were passed. They are included in the template but not useful at initial scaffolding time.

```ts
if (options.example) {
  await createExampleApp(data, targetDir, packageManager);
}
```

Creates the `example/` app (see `createExampleApp.md`). Runs by default, skipped with `--no-example`.

```ts
await createGitRepositoryAsync(targetDir);
```

Initialises a git repository. See [Git setup](#git-setup) below.

### Phase 12: Print next steps

For remote modules with an example app:
```
cd my-module
yarn open:ios
yarn open:android
```

For local modules:
```
import MyModule from './modules/my-module';
```

---

## `askForPackageSlugAsync`

Asks for (or derives) the npm package name — the slug used for the directory name and `package.json` `"name"` field.

- **Interactive:** shows a prompt pre-filled with the `[path]` argument basename if it's a valid npm name
- **Non-interactive:** uses the `[path]` argument basename if valid, otherwise falls back to `'my-module'`
- **Local modules:** prompt says "What is the name of the local module?" instead of "npm package"

---

## Substitution data

`askForSubstitutionDataAsync` builds the data object passed to EJS when rendering every template file. It merges three sources in priority order: **CLI flags > interactive prompts > auto-detected defaults**.

### For remote modules (`SubstitutionData`)

| Field | Source | Example |
|---|---|---|
| `project.slug` | slug prompt / `[path]` arg | `my-module` |
| `project.name` | `--name` / prompt / derived from slug | `MyModule` |
| `project.version` | hardcoded | `0.1.0` |
| `project.description` | `--description` / prompt | `My new module` |
| `project.package` | `--package` / prompt / derived from slug | `expo.modules.mymodule` |
| `project.moduleName` | name + `Module` suffix | `MyModuleModule` → `MyModule` if already suffixed |
| `project.viewName` | name + `View` suffix | `MyModuleView` |
| `author` | `--author-*` / prompt / git config + GitHub API | `Jane <jane@x.com> (https://github.com/jane)` |
| `license` | hardcoded | `MIT` |
| `repo` | `--repo` / prompt / guessed from GitHub profile + slug | `https://github.com/jane/my-module` |

### For local modules (`LocalSubstitutionData`)

Subset of the above — no `version`, `description`, `author`, `license`, or `repo`, since local modules are not published.

### Name derivation helpers

**`slugToModuleName`** — converts a slug to PascalCase:
```
my-module        → MyModule
expo-camera      → ExpoCamera
@scope/foo-bar   → ScopeFooBar
```

**`slugToAndroidPackage`** — converts a slug to a Java package name:
```
my-module        → expo.modules.mymodule
expo-camera      → expo.modules.camera   (strips "expo" prefix)
react-native-foo → expo.modules.foo      (strips "reactnative" prefix)
```

**`handleSuffix`** — appends `Module` or `View` only if not already present:
```
MyModule  → MyModule   (already has suffix)
My        → MyModule
```

**`ensureSafeModuleName`** — checks if the name conflicts with an Apple system framework (e.g. `UIKit`, `Foundation`). If so, renames it and shows a warning. This prevents build errors on iOS.

### Auto-detection for author info

When prompting or in non-interactive mode, the tool tries to fill in author details automatically:
1. `findMyName()` / `findGitHubEmail()` — reads `user.name` and `user.email` from local git config
2. `findGitHubUserFromEmail()` — queries the GitHub API to find a GitHub username from the email
3. `guessRepoUrl()` — constructs a probable repo URL from the GitHub profile URL and slug

All of these fail gracefully, returning empty strings.

---

## Template download

`downloadPackageAsync` fetches the correct template version from npm:

```
EXPO_BETA=true  →  expo-module-template@next
--local flag    →  expo-module-template-local@sdk-<major>  (reads local expo version)
default         →  expo-module-template@latest
```

The download uses `npm pack <package>@<version> --json` which downloads the tarball into a temp directory (`os.tmpdir()/.create-expo-module`) and returns the filename as JSON. The tarball is then extracted into `targetDir/`, where npm places the contents under a `package/` subdirectory.

If the versioned download fails (e.g. `sdk-55` tag doesn't exist), it falls back to `@latest` with a warning.

```
os.tmpdir()/.create-expo-module/
└── expo-module-template-0.x.x.tgz   ← downloaded

targetDir/
└── package/                          ← extracted, returned as packagePath
    ├── $package.json
    ├── ios/
    └── ...
```

---

## Template rendering

`createModuleFromTemplate` iterates every file in the template and processes it with EJS in two passes — once for the **filename**, once for the **file content**.

### Filename rendering

```ts
const renderedRelativePath = ejs.render(file.replace(/^\$/, ''), data, {
  openDelimiter: '{',
  closeDelimiter: '}',
  escape: (value: string) => value.replace(/\./g, path.sep),
});
```

File names use `{` and `}` as EJS delimiters (instead of the default `<%` `%>`) to avoid conflicts with shell and other tooling. Two special conventions:

- **`$` prefix** — stripped before rendering. Used for files that would otherwise be ignored by npm (e.g. `$package.json` → `package.json`, `$.gitignore` → `.gitignore`).
- **Dot-to-separator escape** — dots in interpolated values are converted to `path.sep`. This turns the Android package `expo.modules.mymodule` into a directory path `expo/modules/mymodule` within the file name `android/src/main/java/{%= project.package %}/MyModule.kt`.

### Content rendering

```ts
const renderedContent = ejs.render(template, data);
```

Standard EJS with default `<%` `%>` delimiters. All `data` fields are available — `project.slug`, `project.name`, `project.moduleName`, `project.viewName`, `author`, `repo`, etc.

### `getFilesAsync`

Recursively walks the template directory and returns all file paths relative to the template root, skipping anything in `IGNORES_PATHS`. Uses `lstat` (not `stat`) to avoid following symlinks.

---

## Git setup

`createGitRepositoryAsync` has three outcomes:

| Condition | Returns | Message |
|---|---|---|
| Already inside a git repo | `null` | "Skipped, already within a Git repository" |
| `git` not found in `$PATH` | `false` | "Could not create an empty Git repository" |
| Success | `true` | "Created an empty Git repository" |

On success it runs `git init`, `git add -A`, and makes an initial commit with the message:
```
Initial commit

Generated by create-expo-module <version>.
```

---

## Full execution flow

```
CLI invoked
│
├── isInteractive()               CI env or non-TTY → headless mode
│
├── askForPackageSlugAsync()      prompt or derive slug from [path]
│
├── getCorrectLocalDirectory()    (--local only) walk up to find project root
│
├── mkdir targetDir
│
├── confirmTargetDirAsync()       warn/confirm if dir not empty
│
├── askForSubstitutionDataAsync() collect name, package, author, repo, etc.
│   ├── interactive: show prompts, skip any already provided via CLI flags
│   └── non-interactive: use CLI flags + auto-detected defaults
│
├── resolvePackageManager()       yarn / pnpm / bun / npm
│
├── downloadPackageAsync()        npm pack expo-module-template[@sdk-XX]
│   └── (or use --source dir)
│
├── logEventAsync()               fire telemetry event
│
├── createModuleFromTemplate()    render all EJS template files → targetDir
│
├── (remote only)
│   ├── installDependencies()     yarn/npm install
│   └── build                     expo-module build (tsc)
│
├── rm packagePath                clean up extracted template dir
│
├── (remote only)
│   ├── rm README.md              unless --with-readme
│   ├── rm CHANGELOG.md           unless --with-changelog
│   ├── createExampleApp()        unless --no-example
│   └── createGitRepositoryAsync() git init + initial commit
│
└── printFurtherInstructions()    next steps for the developer
```
