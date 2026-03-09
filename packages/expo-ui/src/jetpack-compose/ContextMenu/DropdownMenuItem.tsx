import { requireNativeView } from 'expo';

import { ViewEvent } from '../../types';

type SlotNativeViewProps = {
  slotName: string;
  children: React.ReactNode;
};

const SlotNativeView: React.ComponentType<SlotNativeViewProps> = requireNativeView(
  'ExpoUI',
  'SlotView'
);

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

type NativeDropdownMenuItemProps = Omit<DropdownMenuItemProps, 'onPress' | 'children'> &
  ViewEvent<'onItemPressed', void> & { children?: React.ReactNode };

const DropdownMenuItemNativeView: React.ComponentType<NativeDropdownMenuItemProps> =
  requireNativeView('ExpoUI', 'DropdownMenuItemView');

/**
 * A leading icon slot for `DropdownMenuItem`.
 * Wrap an `Icon` or other content to display before the menu item text.
 *
 * @platform android
 */
function LeadingIcon(props: { children: React.ReactNode }) {
  return <SlotNativeView slotName="leadingIcon">{props.children}</SlotNativeView>;
}

/**
 * A trailing icon slot for `DropdownMenuItem`.
 * Wrap an `Icon` or other content to display after the menu item text.
 *
 * @platform android
 */
function TrailingIcon(props: { children: React.ReactNode }) {
  return <SlotNativeView slotName="trailingIcon">{props.children}</SlotNativeView>;
}

/**
 * A dropdown menu item component that wraps Compose's `DropdownMenuItem`.
 * Should be used inside `ContextMenu.Items`.
 *
 * @platform android
 */
function DropdownMenuItemComponent(props: DropdownMenuItemProps) {
  const { onPress, children, ...restProps } = props;
  return (
    <DropdownMenuItemNativeView
      {...restProps}
      enabled={props.enabled ?? true}
      onItemPressed={onPress ? () => onPress() : undefined}>
      {children}
    </DropdownMenuItemNativeView>
  );
}

DropdownMenuItemComponent.LeadingIcon = LeadingIcon;
DropdownMenuItemComponent.TrailingIcon = TrailingIcon;

export { DropdownMenuItemComponent as DropdownMenuItem };
