import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
  type ViewProps,
} from "react-native";

import { Icon, type IconProps } from "@/components/ui/Icon";
import { Text, TextClassContext } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-full shadow-none",
    Platform.select({
      web: "aria-invalid:ring-destructive/20 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      action: {
        primary: "",
        tertiary: "",
        negative: "",
      },
      variant: {
        default: "shadow-sm shadow-black/5",
        solid: "shadow-sm shadow-black/5",
        destructive:
          "bg-destructive web:hover:bg-destructive-soft active:bg-destructive-soft web:focus-visible:ring-destructive-soft web:focus-visible:ring-4 shadow-sm shadow-black/5",
        outline: "border-2 bg-transparent",
        secondary: "bg-secondary active:opacity-80 shadow-sm shadow-black/5",
        ghost: "active:bg-accent",
        link: "bg-transparent",
      },
      size: {
        xs: "h-8 gap-2 px-3.5",
        sm: "h-9 gap-2 px-4",
        default: "h-10 gap-2 px-5",
        md: "h-10 gap-2 px-5",
        lg: "h-11 gap-3 px-6",
        xl: "h-12 gap-3 px-7",
        icon: "size-10 p-0",
      },
    },
    compoundVariants: [
      {
        action: "primary",
        variant: ["default", "solid"],
        className:
          "bg-primary web:hover:bg-primary-soft active:bg-primary-soft web:focus-visible:ring-primary-soft web:focus-visible:ring-4",
      },
      {
        action: "tertiary",
        variant: ["default", "solid"],
        className:
          "bg-tertiary web:hover:bg-tertiary-soft active:bg-tertiary-soft web:focus-visible:ring-tertiary-soft web:focus-visible:ring-4",
      },
      {
        action: "negative",
        variant: ["default", "solid"],
        className:
          "bg-destructive web:hover:bg-destructive-soft active:bg-destructive-soft web:focus-visible:ring-destructive-soft web:focus-visible:ring-4",
      },
      {
        action: "primary",
        variant: "outline",
        className:
          "border-primary web:hover:border-primary-border web:hover:bg-primary-soft active:border-primary-border active:bg-primary-soft web:focus-visible:ring-primary-soft web:focus-visible:ring-4",
      },
      {
        action: "tertiary",
        variant: "outline",
        className:
          "border-tertiary web:hover:border-tertiary-border web:hover:bg-tertiary-soft active:border-tertiary-border active:bg-tertiary-soft web:focus-visible:ring-tertiary-soft web:focus-visible:ring-4",
      },
      {
        action: "negative",
        variant: "outline",
        className:
          "border-destructive web:hover:border-destructive-border web:hover:bg-destructive-soft active:border-destructive-border active:bg-destructive-soft web:focus-visible:ring-destructive-soft web:focus-visible:ring-4",
      },
      {
        action: "primary",
        variant: "link",
        className:
          "active:bg-muted web:focus-visible:ring-primary-soft web:focus-visible:ring-4",
      },
      {
        action: "tertiary",
        variant: "link",
        className:
          "active:bg-muted web:focus-visible:ring-tertiary-soft web:focus-visible:ring-4",
      },
      {
        action: "negative",
        variant: "link",
        className:
          "active:bg-muted web:focus-visible:ring-destructive-soft web:focus-visible:ring-4",
      },
    ],
    defaultVariants: {
      action: "primary",
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(
    "font-body-semibold text-sm",
    Platform.select({ web: "pointer-events-none transition-colors" }),
  ),
  {
    variants: {
      action: {
        primary: "",
        tertiary: "",
        negative: "",
      },
      variant: {
        default: "",
        solid: "",
        destructive:
          "text-destructive-foreground web:group-hover:text-destructive-status-foreground group-active:text-destructive-status-foreground",
        outline: "",
        secondary: "text-secondary-foreground",
        ghost: "text-foreground",
        link: "underline",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-base",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        icon: "text-base",
      },
    },
    compoundVariants: [
      {
        action: "primary",
        variant: ["default", "solid"],
        className:
          "text-primary-foreground web:group-hover:text-primary-strong group-active:text-primary-strong",
      },
      {
        action: "tertiary",
        variant: ["default", "solid"],
        className:
          "text-tertiary-foreground web:group-hover:text-tertiary-strong group-active:text-tertiary-strong",
      },
      {
        action: "negative",
        variant: ["default", "solid"],
        className:
          "text-destructive-foreground web:group-hover:text-destructive-status-foreground group-active:text-destructive-status-foreground",
      },
      {
        action: "primary",
        variant: ["outline", "link"],
        className:
          "text-primary web:group-hover:text-primary-strong group-active:text-primary-strong",
      },
      {
        action: "tertiary",
        variant: ["outline", "link"],
        className:
          "text-tertiary web:group-hover:text-tertiary-strong group-active:text-tertiary-strong",
      },
      {
        action: "negative",
        variant: ["outline", "link"],
        className:
          "text-destructive web:group-hover:text-destructive-status-foreground group-active:text-destructive-status-foreground",
      },
    ],
    defaultVariants: {
      action: "primary",
      variant: "default",
      size: "default",
    },
  },
);

/** Closed visual variants supported by Button. */
type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/** Props supported by the shared button primitive. */
type ButtonProps = React.ComponentProps<typeof Pressable> & ButtonVariantProps;

/** Visual values inherited by compound button children. */
interface ButtonContextValue extends ButtonVariantProps {
  iconClassName: string;
}

const ButtonContext = React.createContext<ButtonContextValue>({
  action: "primary",
  iconClassName: "text-primary-foreground",
  size: "default",
  variant: "default",
});

/** Pressable button primitive with Fifteen actions and shadcn composition. */
function Button({
  action = "primary",
  className,
  size = "default",
  variant = "default",
  ...props
}: ButtonProps) {
  const textClassName = buttonTextVariants({ action, size, variant });
  const contextValue = React.useMemo(
    () => ({ action, iconClassName: textClassName, size, variant }),
    [action, size, textClassName, variant],
  );

  return (
    <ButtonContext.Provider value={contextValue}>
      <TextClassContext.Provider value={textClassName}>
        <Pressable
          accessibilityRole="button"
          className={cn(
            props.disabled && "opacity-40",
            buttonVariants({ action, size, variant }),
            className,
          )}
          {...props}
        />
      </TextClassContext.Provider>
    </ButtonContext.Provider>
  );
}

/** Explicit text child for compound button compositions. */
function ButtonText(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} />;
}

/** Lucide icon child inheriting the current button foreground treatment. */
function ButtonIcon({ className, size: requestedSize, ...props }: IconProps) {
  const { iconClassName, size } = React.useContext(ButtonContext);
  const iconSize = requestedSize ?? resolveButtonIconSize(size);

  return (
    <Icon className={cn(iconClassName, className)} size={iconSize} {...props} />
  );
}

/** Resolves Fifteen's icon scale from the owning button size. */
function resolveButtonIconSize(size: ButtonVariantProps["size"]) {
  if (size === "xs") return 14;
  if (size === "sm") return 16;
  if (size === "lg") return 20;
  if (size === "xl") return 24;
  if (size === "icon") return 20;
  return 18;
}

/** Busy indicator sized consistently with the current button. */
function ButtonSpinner(props: React.ComponentProps<typeof ActivityIndicator>) {
  const { size } = React.useContext(ButtonContext);
  return (
    <ActivityIndicator size={size === "xl" ? "large" : "small"} {...props} />
  );
}

/** Props accepted by a related group of buttons. */
type ButtonGroupProps = ViewProps & {
  orientation?: "horizontal" | "vertical";
};

/** Layout primitive for related button actions. */
function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <View
      className={cn(
        orientation === "horizontal" ? "flex-row" : "flex-col",
        "gap-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  buttonTextVariants,
  buttonVariants,
};
export type { ButtonGroupProps, ButtonProps, ButtonVariantProps };
