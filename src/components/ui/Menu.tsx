import {
  Content as DropdownMenuContentPrimitive,
  Item as DropdownMenuItemPrimitive,
  Overlay as DropdownMenuOverlayPrimitive,
  Portal as DropdownMenuPortalPrimitive,
  Root as DropdownMenuRootPrimitive,
  Separator as DropdownMenuSeparatorPrimitive,
  Trigger as DropdownMenuTriggerPrimitive,
} from "@rn-primitives/dropdown-menu";
import { cva } from "class-variance-authority";
import * as React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { Icon, type IconProps } from "@/components/ui/Icon";
import { Text, type TextProps } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

/** Sizes supported by the shared menu primitive. */
type MenuSize = "md" | "sm";

const MenuSizeContext = React.createContext<MenuSize>("sm");

/** Transient layout and action behavior shared by the Menu anatomy. */
interface MenuBehaviorContextValue {
  matchTriggerWidth: boolean;
  onAction?: (key: React.Key) => void;
  setTriggerWidth: React.Dispatch<React.SetStateAction<number | undefined>>;
  triggerWidth?: number;
}

const MenuBehaviorContext = React.createContext<
  MenuBehaviorContextValue | undefined
>(undefined);

const menuItemVariants = cva(
  cn(
    "group flex-row items-center gap-2 rounded-xl",
    "active:bg-accent",
    Platform.select({
      web: "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none cursor-default outline-none",
    }),
  ),
  {
    variants: {
      size: {
        md: "p-3",
        sm: "px-3 py-2",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

const menuItemIconVariants = cva(
  "text-popover-foreground pointer-events-none shrink-0",
  {
    variants: {
      size: {
        md: "size-6",
        sm: "size-4",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

/** Props accepted by the menu state root. */
type MenuProps = React.ComponentProps<typeof DropdownMenuRootPrimitive> & {
  /** Matches the menu surface width to the measured trigger width. */
  matchTriggerWidth?: boolean;
  /** Handles activation of an item identified by its React collection key. */
  onAction?: (key: React.Key) => void;
  /** Visual size inherited by items, labels, and icons. */
  size?: MenuSize;
};

/** Shadcn-style menu state root backed by the accessible native primitive. */
function Menu({
  matchTriggerWidth = false,
  onAction,
  size = "sm",
  ...props
}: MenuProps) {
  const [triggerWidth, setTriggerWidth] = React.useState<number>();
  const behavior = React.useMemo(
    () => ({ matchTriggerWidth, onAction, setTriggerWidth, triggerWidth }),
    [matchTriggerWidth, onAction, triggerWidth],
  );

  return (
    <MenuSizeContext.Provider value={size}>
      <MenuBehaviorContext.Provider value={behavior}>
        <DropdownMenuRootPrimitive {...props} />
      </MenuBehaviorContext.Provider>
    </MenuSizeContext.Provider>
  );
}

/** Trigger that records its layout for optional surface-width matching. */
function MenuTrigger({
  onLayout,
  ...props
}: React.ComponentProps<typeof DropdownMenuTriggerPrimitive>) {
  const { setTriggerWidth } = useMenuBehavior();

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      setTriggerWidth(event.nativeEvent.layout.width);
      onLayout?.(event);
    },
    [onLayout, setTriggerWidth],
  );

  return <DropdownMenuTriggerPrimitive onLayout={handleLayout} {...props} />;
}

/** Props accepted by the portaled menu surface. */
type MenuContentProps = Omit<
  React.ComponentProps<typeof DropdownMenuContentPrimitive>,
  "children" | "style"
> & {
  children?: React.ReactNode;
  /** Additional classes applied to the scrollable item container. */
  contentContainerClassName?: string;
  /** Additional classes applied to the dismissing overlay. */
  overlayClassName?: string;
  /** Imperative overlay style forwarded to the portal boundary. */
  overlayStyle?: StyleProp<ViewStyle>;
  /** Optional named native portal host. */
  portalHost?: string;
  style?: StyleProp<ViewStyle>;
};

/** Portaled, dismissible menu content matching the Fifteen dimensions. */
function MenuContent({
  align = "start",
  children,
  className,
  contentContainerClassName,
  overlayClassName,
  overlayStyle,
  portalHost,
  side = "bottom",
  sideOffset = 8,
  style,
  ...props
}: MenuContentProps) {
  const { matchTriggerWidth, triggerWidth } = useMenuBehavior();
  const triggerWidthStyle =
    matchTriggerWidth && triggerWidth !== undefined
      ? { width: triggerWidth }
      : undefined;
  const contentStyle = StyleSheet.flatten<ViewStyle>([
    style,
    triggerWidthStyle,
  ]);

  return (
    <DropdownMenuPortalPrimitive hostName={portalHost}>
      <FullWindowOverlay>
        <DropdownMenuOverlayPrimitive
          className={overlayClassName}
          style={Platform.select({
            web: overlayStyle ?? undefined,
            native: overlayStyle
              ? StyleSheet.flatten([StyleSheet.absoluteFill, overlayStyle])
              : StyleSheet.absoluteFill,
          })}
        >
          <DropdownMenuContentPrimitive
            align={align}
            className={cn(
              "border-border bg-popover w-menu max-h-80 overflow-hidden rounded-2xl border p-2 shadow-lg shadow-black/5",
              Platform.select({ web: "z-50 cursor-default" }),
              className,
            )}
            side={side}
            sideOffset={sideOffset}
            style={contentStyle}
            {...props}
          >
            <ScrollView
              className="max-h-76"
              contentContainerClassName={cn("gap-2", contentContainerClassName)}
              showsVerticalScrollIndicator={false}
            >
              {injectMenuItemActionKeys(children)}
            </ScrollView>
          </DropdownMenuContentPrimitive>
        </DropdownMenuOverlayPrimitive>
      </FullWindowOverlay>
    </DropdownMenuPortalPrimitive>
  );
}

/** Props accepted by one actionable menu row. */
type MenuItemProps = Omit<
  React.ComponentProps<typeof DropdownMenuItemPrimitive>,
  "textValue"
> & {
  /** Localized accessible name announced for the menu action. */
  textValue: string;
};

/** Private action identity injected from an item's React collection key. */
type MenuItemInternalProps = MenuItemProps & {
  actionKey?: React.Key;
};

/** Accessible menu action that inherits the root size. */
function MenuItem({
  actionKey,
  className,
  disabled = false,
  onPress,
  ...props
}: MenuItemInternalProps) {
  const size = React.useContext(MenuSizeContext);
  const { onAction } = useMenuBehavior();

  const handlePress = React.useCallback(
    (event: Parameters<NonNullable<typeof onPress>>[0]) => {
      onPress?.(event);

      if (actionKey !== undefined) {
        onAction?.(actionKey);
      }
    },
    [actionKey, onAction, onPress],
  );

  return (
    <DropdownMenuItemPrimitive
      className={cn(
        menuItemVariants({ size }),
        disabled && "opacity-40",
        className,
      )}
      disabled={disabled}
      onPress={handlePress}
      {...props}
    />
  );
}

/** Props accepted by a menu item label. */
type MenuItemLabelProps = TextProps;

/** Menu label using Poppins and the root menu size by default. */
function MenuItemLabel({
  className,
  size: explicitSize,
  ...props
}: MenuItemLabelProps) {
  const size = React.useContext(MenuSizeContext);

  return (
    <Text
      className={cn("text-popover-foreground min-w-0 flex-1", className)}
      size={explicitSize ?? size}
      {...props}
    />
  );
}

/** Props accepted by a menu item icon. */
type MenuItemIconProps = IconProps;

/** Decorative item icon inheriting the root menu size by default. */
function MenuItemIcon({
  className,
  size: explicitSize,
  ...props
}: MenuItemIconProps) {
  const size = React.useContext(MenuSizeContext);

  return (
    <Icon
      accessible={false}
      className={cn(menuItemIconVariants({ size }), className)}
      importantForAccessibility="no"
      size={explicitSize ?? (size === "md" ? 24 : 16)}
      {...props}
    />
  );
}

/** Decorative divider between menu item groups. */
function MenuSeparator({
  className,
  decorative = true,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparatorPrimitive>) {
  return (
    <DropdownMenuSeparatorPrimitive
      className={cn("bg-border h-px w-full", className)}
      decorative={decorative}
      {...props}
    />
  );
}

/** Returns the behavior owned by the nearest Menu root. */
function useMenuBehavior() {
  const context = React.useContext(MenuBehaviorContext);

  if (context === undefined) {
    throw new Error("Menu compound components must be rendered inside Menu.");
  }

  return context;
}

/** Copies each direct item's React key into its internal action identity. */
function injectMenuItemActionKeys(children: React.ReactNode) {
  return React.Children.map(children, (child) => {
    if (
      !React.isValidElement<MenuItemInternalProps>(child) ||
      child.type !== MenuItem ||
      child.key === null
    ) {
      return child;
    }

    return React.cloneElement(child, { actionKey: child.key });
  });
}

export {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuSeparator,
  MenuTrigger,
  menuItemVariants,
};
export type {
  MenuContentProps,
  MenuItemIconProps,
  MenuItemLabelProps,
  MenuItemProps,
  MenuProps,
  MenuSize,
};
