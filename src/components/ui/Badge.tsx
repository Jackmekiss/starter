import { cva } from "class-variance-authority";
import * as React from "react";
import { View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Text, TextClassContext } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { ComponentProps, ReactNode } from "react";

/** Semantic purposes supported by the Badge primitive. */
type BadgeAction =
  | "error"
  | "info"
  | "muted"
  | "primary"
  | "success"
  | "warning";

/** Badge sizes defined by the Fifteen design system. */
type BadgeSize = "lg" | "md" | "sm";

/** Badge surface treatments. */
type BadgeVariant = "outline" | "solid";

const badgeVariants = cva(
  "flex-row items-center justify-center gap-1 rounded-full",
  {
    variants: {
      action: {
        error: "bg-destructive-soft",
        info: "bg-info-soft",
        muted: "bg-muted",
        primary: "bg-primary-soft",
        success: "bg-success-soft",
        warning: "bg-warning-soft",
      },
      size: {
        lg: "px-2 py-1",
        md: "px-2 py-1",
        sm: "px-2 py-1",
      },
      variant: {
        outline: "border",
        solid: "",
      },
    },
    compoundVariants: [
      {
        action: "error",
        variant: "outline",
        className: "border-destructive-border",
      },
      {
        action: "info",
        variant: "outline",
        className: "border-info-border",
      },
      {
        action: "muted",
        variant: "outline",
        className: "border-border-subtle",
      },
      {
        action: "primary",
        variant: "outline",
        className: "border-primary-border",
      },
      {
        action: "success",
        variant: "outline",
        className: "border-success-border",
      },
      {
        action: "warning",
        variant: "outline",
        className: "border-warning-border",
      },
    ],
    defaultVariants: {
      action: "error",
      size: "sm",
      variant: "solid",
    },
  },
);

const badgeTextVariants = cva("font-normal", {
  variants: {
    action: {
      error: "text-destructive-status-foreground",
      info: "text-info-foreground",
      muted: "text-secondary-foreground",
      primary: "text-primary-emphasis",
      success: "text-success-foreground",
      warning: "text-warning-foreground",
    },
    size: {
      lg: "text-sm leading-6",
      md: "text-xs leading-[18px]",
      sm: "text-[10px] leading-6",
    },
  },
  defaultVariants: {
    action: "error",
    size: "sm",
  },
});

/** Values inherited by Badge compound components. */
interface BadgeStyleContextValue {
  /** Semantic purpose of the Badge. */
  action: BadgeAction;
  /** Visual size of the Badge. */
  size: BadgeSize;
}

const BadgeStyleContext = React.createContext<BadgeStyleContextValue>({
  action: "error",
  size: "sm",
});

/** Props accepted by the Badge surface. */
interface BadgeProps extends Omit<ComponentProps<typeof View>, "children"> {
  /** Semantic purpose controlling surface and foreground colors. */
  action?: BadgeAction;
  /** Visible badge content. Plain strings are wrapped in shared Text. */
  children?: ReactNode;
  /** Visual size of the Badge. */
  size?: BadgeSize;
  /** Filled or outlined surface treatment. */
  variant?: BadgeVariant;
}

/** Props accepted by explicit Badge text. */
type BadgeTextProps = ComponentProps<typeof Text>;

/** Props accepted by a Badge icon. */
interface BadgeIconProps extends ComponentProps<typeof Icon> {
  /** Whether the icon appears before or after the label. */
  placement?: "left" | "right";
}

/** Compact semantic label supporting direct text and compound children. */
const Badge = React.forwardRef<React.ComponentRef<typeof View>, BadgeProps>(
  (
    {
      action = "error",
      children,
      className,
      size = "sm",
      variant = "solid",
      ...props
    },
    ref,
  ) => {
    const textClassName = badgeTextVariants({ action, size });
    const contextValue = React.useMemo(
      () => ({ action, size }),
      [action, size],
    );
    const content =
      typeof children === "string" || typeof children === "number" ? (
        <Text>{children}</Text>
      ) : (
        children
      );

    return (
      <BadgeStyleContext.Provider value={contextValue}>
        <TextClassContext.Provider value={textClassName}>
          <View
            ref={ref}
            className={cn(badgeVariants({ action, size, variant }), className)}
            {...props}
          >
            {content}
          </View>
        </TextClassContext.Provider>
      </BadgeStyleContext.Provider>
    );
  },
);

/** Explicit Badge text inheriting the parent action and size. */
function BadgeText({ className, ...props }: BadgeTextProps) {
  const { action, size } = React.useContext(BadgeStyleContext);

  return (
    <Text
      className={cn(badgeTextVariants({ action, size }), className)}
      {...props}
    />
  );
}

/** Decorative Badge icon scaled by placement and parent size. */
function BadgeIcon({
  className,
  placement = "left",
  size: explicitSize,
  ...props
}: BadgeIconProps) {
  const { action, size } = React.useContext(BadgeStyleContext);
  const iconSize = explicitSize ?? resolveBadgeIconSize(size, placement);

  return (
    <Icon
      accessible={false}
      className={cn(badgeTextVariants({ action, size }), className)}
      importantForAccessibility="no"
      size={iconSize}
      {...props}
    />
  );
}

/** Resolves the Fifteen icon scale for one Badge placement. */
function resolveBadgeIconSize(size: BadgeSize, placement: "left" | "right") {
  if (placement === "right") {
    if (size === "lg") return 16;
    if (size === "md") return 14;
    return 12;
  }

  if (size === "lg") return 24;
  if (size === "md") return 18;
  return 16;
}

Badge.displayName = "Badge";

export { Badge, BadgeIcon, BadgeText, badgeTextVariants, badgeVariants };
export type {
  BadgeAction,
  BadgeIconProps,
  BadgeProps,
  BadgeSize,
  BadgeTextProps,
  BadgeVariant,
};
