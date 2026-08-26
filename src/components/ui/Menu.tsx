import { createMenu } from "@gluestack-ui/core/menu/creator";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { styled } from "nativewind";
import { createContext, forwardRef, useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

import { UiIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentRef,
} from "react";

/* eslint-disable @typescript-eslint/consistent-type-assertions -- Local bounds prevent recursive NativeWind/gluestack type expansion. */

const AnimatedView = Animated.createAnimatedComponent(ScrollView);

const menuStyle = tva({
  base: "border-border-100 bg-background-0 max-h-80 w-menu overflow-y-auto rounded-2xl border p-2 shadow-sm",
});

const menuItemStyle = tva({
  base: "flex-row items-center gap-2 rounded-xl data-[hover=true]:bg-background-100 data-[active=true]:bg-background-100 data-[focus=true]:bg-background-100 data-[selected=true]:bg-background-100 data-[focus=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-border-300 data-[disabled=true]:opacity-40 data-[disabled=true]:web:cursor-not-allowed data-[disabled=true]:data-[focus=true]:bg-transparent",
  variants: {
    size: {
      md: "p-3",
      sm: "px-3 py-2",
    },
  },
});

const menuBackdropStyle = tva({
  base: "absolute inset-0 web:cursor-default",
});

const menuSeparatorStyle = tva({
  base: "bg-border-100 h-px w-full",
});

const menuItemLabelStyle = tva({
  base: "text-typography-900 min-w-0 flex-1 font-body font-normal",
  variants: {
    bold: {
      true: "font-bold",
    },
    highlight: {
      true: "bg-warning-500",
    },
    isTruncated: {
      true: "web:truncate",
    },
    italic: {
      true: "italic",
    },
    size: {
      md: "text-base",
      sm: "text-sm leading-[21px]",
    },
    strikeThrough: {
      true: "line-through",
    },
    sub: {
      true: "text-xs",
    },
    underline: {
      true: "underline",
    },
  },
});

const menuItemIconStyle = tva({
  base: "fill-typography-900 pointer-events-none shrink-0",
  variants: {
    size: {
      md: "h-6 w-6",
      sm: "h-4 w-4",
    },
  },
});

/** Sizes supported by the Figma menu primitive. */
type MenuSize = "md" | "sm";

const MenuSizeContext = createContext<MenuSize>("sm");

/** Props accepted by the dismissible menu backdrop. */
type MenuBackdropProps = ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof menuBackdropStyle>;

const MenuBackdrop = forwardRef<
  ComponentRef<typeof Pressable>,
  MenuBackdropProps
>(({ className, ...props }, ref) => (
  <Pressable
    ref={ref}
    className={menuBackdropStyle({ class: className })}
    {...props}
  />
));

/** Props accepted by an internally styled menu item. */
type MenuItemRootProps = ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof menuItemStyle>;

const MenuItemRoot = forwardRef<
  ComponentRef<typeof Pressable>,
  MenuItemRootProps
>(({ className, ...props }, ref) => {
  const size = useContext(MenuSizeContext);

  return (
    <Pressable
      ref={ref}
      className={menuItemStyle({ class: className, size })}
      {...props}
    />
  );
});

/** Props accepted by an internally styled menu separator. */
type MenuSeparatorRootProps = ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof menuSeparatorStyle>;

const MenuSeparatorRoot = forwardRef<
  ComponentRef<typeof View>,
  MenuSeparatorRootProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={menuSeparatorStyle({ class: className })}
    {...props}
  />
));

/** Bounded public surface of the styled animated menu root. */
type StyledAnimatedViewComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    ComponentPropsWithoutRef<typeof ScrollView> & {
      entering?: unknown;
      exiting?: unknown;
    }
  > &
    React.RefAttributes<ComponentRef<typeof ScrollView>>
>;

// Bound the adapter type so NativeWind does not recursively expand Reanimated's full style union.
const createStyledAnimatedView = styled as unknown as (
  component: unknown,
  config: { className: "style" },
) => StyledAnimatedViewComponent;

const StyledAnimatedView = createStyledAnimatedView(AnimatedView, {
  className: "style",
});

/** Selection value emitted by the gluestack collection state. */
type MenuSelection = "all" | Set<React.Key>;

/** Bounded public props matching gluestack's Menu runtime contract. */
interface MenuPrimitiveProps extends ComponentPropsWithoutRef<
  typeof ScrollView
> {
  children?: React.ReactNode;
  closeOnSelect?: boolean;
  crossOffset?: number;
  defaultIsOpen?: boolean;
  disabledKeys?: string[];
  entering?: unknown;
  exiting?: unknown;
  isOpen?: boolean;
  offset?: number;
  onAction?: (key: React.Key) => void;
  onClose?: () => void;
  onOpen?: () => void;
  onSelectionChange?: (keys: MenuSelection) => void;
  placement?:
    | "bottom"
    | "bottom left"
    | "bottom right"
    | "left"
    | "left bottom"
    | "left top"
    | "right"
    | "right bottom"
    | "right top"
    | "top"
    | "top left"
    | "top right";
  selectedKeys?: MenuSelection;
  selectionMode?: "multiple" | "none" | "single";
  shouldFlip?: boolean;
  shouldOverlapWithTrigger?: boolean;
  trigger: (
    props: ComponentPropsWithoutRef<typeof Pressable>,
    state: { open: boolean },
  ) => React.JSX.Element;
  useRNModal?: boolean;
}

/** Bounded props accepted by a direct gluestack menu item. */
type MenuPrimitiveItemProps = ComponentPropsWithoutRef<typeof Pressable> & {
  closeOnSelect?: boolean;
  textValue?: string;
};

/** Compound component type retained after bounding creator inference. */
type MenuPrimitiveComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MenuPrimitiveProps> &
    React.RefAttributes<ComponentRef<typeof ScrollView>>
> & {
  Item: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<MenuPrimitiveItemProps> &
      React.RefAttributes<ComponentRef<typeof Pressable>>
  >;
  ItemLabel: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<ComponentPropsWithoutRef<typeof Text>> &
      React.RefAttributes<ComponentRef<typeof Text>>
  >;
  Separator: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<ComponentPropsWithoutRef<typeof View>> &
      React.RefAttributes<ComponentRef<typeof View>>
  >;
};

const createBoundedMenu = createMenu as unknown as (parts: {
  Backdrop: unknown;
  Item: unknown;
  Label: unknown;
  Root: unknown;
  Separator: unknown;
}) => MenuPrimitiveComponent;

const UiMenu = createBoundedMenu({
  Root: StyledAnimatedView,
  Item: MenuItemRoot,
  Label: Text,
  Backdrop: MenuBackdrop,
  Separator: MenuSeparatorRoot,
});

/** Props accepted by the menu root. */
type MenuProps = MenuPrimitiveProps & {
  className?: string;
  contentContainerClassName?: string;
  size?: MenuSize;
};

/** Accessible popover menu matching the shared Figma menu primitive. */
const Menu = forwardRef<ComponentRef<typeof UiMenu>, MenuProps>(
  ({ className, contentContainerClassName, size = "sm", ...props }, ref) => (
    <MenuSizeContext.Provider value={size}>
      <UiMenu
        entering={ZoomIn.duration(150)}
        exiting={FadeOut.duration(150)}
        ref={ref}
        className={menuStyle({ class: className })}
        contentContainerClassName={cn("gap-2", contentContainerClassName)}
        {...props}
      />
    </MenuSizeContext.Provider>
  ),
);

const MenuItem = UiMenu.Item;

/** Props accepted by a menu item label. */
type MenuItemLabelProps = ComponentProps<typeof UiMenu.ItemLabel> &
  VariantProps<typeof menuItemLabelStyle> & {
    className?: string;
  };

/** Item label that inherits typography from the menu size. */
const MenuItemLabel = forwardRef<
  ComponentRef<typeof UiMenu.ItemLabel>,
  MenuItemLabelProps
>(
  (
    {
      bold,
      className,
      highlight,
      isTruncated,
      italic,
      strikeThrough,
      sub,
      underline,
      ...props
    },
    ref,
  ) => {
    const size = useContext(MenuSizeContext);

    return (
      <UiMenu.ItemLabel
        ref={ref}
        className={menuItemLabelStyle({
          bold: Boolean(bold),
          class: className,
          highlight: Boolean(highlight),
          isTruncated: Boolean(isTruncated),
          italic: Boolean(italic),
          size,
          strikeThrough: Boolean(strikeThrough),
          sub: Boolean(sub),
          underline: Boolean(underline),
        })}
        {...props}
      />
    );
  },
);

/** Props accepted by a menu item icon. */
type MenuItemIconProps = ComponentPropsWithoutRef<typeof UiIcon> & {
  className?: string;
  height?: number;
  width?: number;
};

/** Item icon that inherits the 16 px or 24 px Figma size from the menu. */
const MenuItemIcon = forwardRef<ComponentRef<typeof UiIcon>, MenuItemIconProps>(
  ({ className, size: explicitSize, ...props }, ref) => {
    const size = useContext(MenuSizeContext);

    if (typeof explicitSize === "number") {
      return (
        <UiIcon
          ref={ref}
          className={menuItemIconStyle({ class: className })}
          size={explicitSize}
          {...props}
        />
      );
    }

    if (props.height !== undefined || props.width !== undefined) {
      return (
        <UiIcon
          ref={ref}
          className={menuItemIconStyle({ class: className })}
          {...props}
        />
      );
    }

    return (
      <UiIcon
        ref={ref}
        className={menuItemIconStyle({ class: className, size })}
        {...props}
      />
    );
  },
);

const MenuSeparator = UiMenu.Separator;

Menu.displayName = "Menu";
MenuItem.displayName = "MenuItem";
MenuItemIcon.displayName = "MenuItemIcon";
MenuItemLabel.displayName = "MenuItemLabel";
MenuSeparator.displayName = "MenuSeparator";

export {
  Menu,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuSeparator,
  type MenuItemIconProps,
  type MenuItemLabelProps,
  type MenuProps,
};
