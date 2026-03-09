/**
 * Props of the `DropdownMenuItem` component.
 */
export type DropdownMenuItemProps = {
    /**
     * The text label displayed in the menu item.
     */
    text: string;
    /**
     * Whether the menu item is enabled.
     * @default true
     */
    enabled?: boolean;
    /**
     * Callback that is called when the menu item is pressed.
     */
    onPress?: () => void;
    /**
     * Slot children for leading/trailing icons.
     */
    children?: React.ReactNode;
};
/**
 * A dropdown menu item component that wraps Compose's `DropdownMenuItem`.
 * Should be used inside `ContextMenu.Items`.
 *
 * @platform android
 */
declare function DropdownMenuItemComponent(props: DropdownMenuItemProps): import("react").JSX.Element;
declare namespace DropdownMenuItemComponent {
    var LeadingIcon: (props: {
        children: React.ReactNode;
    }) => import("react").JSX.Element;
    var TrailingIcon: (props: {
        children: React.ReactNode;
    }) => import("react").JSX.Element;
}
export { DropdownMenuItemComponent as DropdownMenuItem };
//# sourceMappingURL=DropdownMenuItem.d.ts.map