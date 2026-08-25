import { cva } from "class-variance-authority";
import {
  CircleCheck,
  CircleX,
  Clock3,
  Info,
  TriangleAlert,
} from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

const alertIcons = {
  error: CircleX,
  info: Info,
  muted: Clock3,
  success: CircleCheck,
  warning: TriangleAlert,
} as const;

/** Semantic purpose supported by the Alert primitive. */
type AlertAction = keyof typeof alertIcons;

/** Content density supported by the Alert primitive. */
type AlertType = "with-heading" | "without-heading";

/** Internal surface treatments used by the Alert style table. */
type AlertStyleVariant = "outline" | "solid";

/** Public Alert surface treatments. */
type AlertVariant = AlertStyleVariant;

const alertVariants = cva(
  "flex-row items-start gap-2 rounded-2xl border px-4 py-3",
  {
    variants: {
      action: {
        error: "",
        info: "",
        muted: "",
        success: "",
        warning: "",
      },
      variant: {
        outline: "border-control-border-strong bg-background",
        solid: "",
      },
    },
    compoundVariants: [
      {
        action: "error",
        variant: "solid",
        className: "border-destructive-strong bg-destructive-soft",
      },
      {
        action: "info",
        variant: "solid",
        className: "border-info-foreground bg-info-soft",
      },
      {
        action: "muted",
        variant: "solid",
        className: "border-border-strong bg-muted",
      },
      {
        action: "success",
        variant: "solid",
        className: "border-success-foreground bg-success-soft",
      },
      {
        action: "warning",
        variant: "solid",
        className: "border-warning-foreground bg-warning-soft",
      },
    ],
    defaultVariants: {
      action: "muted",
      variant: "outline",
    },
  },
);

const alertForegroundVariants = cva("", {
  variants: {
    action: {
      error: "",
      info: "",
      muted: "",
      success: "",
      warning: "",
    },
    variant: {
      outline: "",
      solid: "",
    },
  },
  compoundVariants: [
    {
      action: "error",
      variant: "outline",
      className: "text-destructive-emphasis",
    },
    {
      action: "info",
      variant: "outline",
      className: "text-info-emphasis",
    },
    {
      action: "muted",
      variant: "outline",
      className: "text-secondary-foreground",
    },
    {
      action: "success",
      variant: "outline",
      className: "text-success-emphasis",
    },
    {
      action: "warning",
      variant: "outline",
      className: "text-warning-emphasis",
    },
    {
      action: "error",
      variant: "solid",
      className: "text-destructive-status-foreground",
    },
    {
      action: "info",
      variant: "solid",
      className: "text-info-foreground",
    },
    {
      action: "muted",
      variant: "solid",
      className: "text-secondary-foreground",
    },
    {
      action: "success",
      variant: "solid",
      className: "text-success-foreground",
    },
    {
      action: "warning",
      variant: "solid",
      className: "text-warning-foreground",
    },
  ],
  defaultVariants: {
    action: "muted",
    variant: "outline",
  },
});

/** Styling values inherited by Alert compound components. */
interface AlertStyleContextValue {
  /** Semantic purpose of the Alert. */
  action: AlertAction;
  /** Content density of the Alert. */
  type: AlertType;
  /** Normalized Alert surface treatment. */
  variant: AlertStyleVariant;
}

const AlertStyleContext = React.createContext<AlertStyleContextValue>({
  action: "muted",
  type: "without-heading",
  variant: "outline",
});

/** Props accepted by the Alert surface. */
interface AlertProps extends ComponentProps<typeof View> {
  /** Semantic purpose controlling icon and color. */
  action?: AlertAction;
  /** Whether the Alert includes a title. */
  type?: AlertType;
  /** Outline or softly filled surface treatment. */
  variant?: AlertVariant;
}

/** Props accepted by the Alert content column. */
type AlertContentProps = ComponentProps<typeof View>;

/** Props accepted by the Alert title. */
type AlertTitleProps = ComponentProps<typeof Text>;

/** Props accepted by the Alert supporting copy. */
type AlertDescriptionProps = ComponentProps<typeof Text>;

/** Props accepted by the Alert action link. */
type AlertLinkProps = ComponentProps<typeof Link>;

/** Props accepted by the semantic Alert icon. */
interface AlertIconProps extends Omit<ComponentProps<typeof Icon>, "as"> {
  /** Overrides the action inherited from the Alert. */
  action?: AlertAction;
  /** Overrides the default icon selected for the action. */
  as?: ComponentProps<typeof Icon>["as"];
}

/** Persistent contextual feedback with semantic action styling. */
const Alert = React.forwardRef<React.ComponentRef<typeof View>, AlertProps>(
  (
    {
      accessibilityLiveRegion = "polite",
      accessibilityRole = "alert",
      action = "muted",
      className,
      type = "without-heading",
      variant = "outline",
      ...props
    },
    ref,
  ) => {
    const contextValue = React.useMemo(
      () => ({ action, type, variant }),
      [action, type, variant],
    );

    return (
      <AlertStyleContext.Provider value={contextValue}>
        <View
          ref={ref}
          accessibilityLiveRegion={accessibilityLiveRegion}
          accessibilityRole={accessibilityRole}
          className={cn(alertVariants({ action, variant }), className)}
          {...props}
        />
      </AlertStyleContext.Provider>
    );
  },
);

/** Groups Alert text and its optional action using the design-system spacing. */
const AlertContent = React.forwardRef<
  React.ComponentRef<typeof View>,
  AlertContentProps
>(({ className, ...props }, ref) => {
  const { type } = React.useContext(AlertStyleContext);

  return (
    <View
      ref={ref}
      className={cn(
        "min-w-0 flex-1 items-start",
        type === "with-heading" ? "gap-1.5" : "gap-2",
        className,
      )}
      {...props}
    />
  );
});

/** Alert title following the parent semantic foreground. */
function AlertTitle({ className, ...props }: AlertTitleProps) {
  const { action, variant } = React.useContext(AlertStyleContext);

  return (
    <Text
      className={cn(
        "font-body-semibold text-base",
        alertForegroundVariants({ action, variant }),
        className,
      )}
      {...props}
    />
  );
}

/** Alert supporting copy following the parent semantic foreground. */
function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  const { action, variant } = React.useContext(AlertStyleContext);

  return (
    <Text
      className={cn(
        "text-sm",
        alertForegroundVariants({ action, variant }),
        className,
      )}
      {...props}
    />
  );
}

/** Optional Alert action rendered through the shared link primitive. */
const AlertLink = React.forwardRef<
  React.ComponentRef<typeof Link>,
  AlertLinkProps
>(({ textClassName, ...props }, ref) => {
  const { action, variant } = React.useContext(AlertStyleContext);

  return (
    <Link
      ref={ref}
      textClassName={cn(
        alertForegroundVariants({ action, variant }),
        textClassName,
      )}
      {...props}
    />
  );
});

/** Decorative semantic icon selected from the parent Alert action. */
function AlertIcon({
  action: actionOverride,
  as,
  className,
  ...props
}: AlertIconProps) {
  const { action: parentAction, variant } = React.useContext(AlertStyleContext);
  const action = actionOverride ?? parentAction;
  const ActionIcon = as ?? alertIcons[action];

  return (
    <Icon
      accessible={false}
      as={ActionIcon}
      className={cn(
        "mt-0.5 shrink-0",
        alertForegroundVariants({ action, variant }),
        className,
      )}
      importantForAccessibility="no"
      size={20}
      {...props}
    />
  );
}

Alert.displayName = "Alert";
AlertContent.displayName = "AlertContent";
AlertLink.displayName = "AlertLink";

export {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertLink,
  AlertTitle,
  alertVariants,
};
export type {
  AlertAction,
  AlertContentProps,
  AlertDescriptionProps,
  AlertIconProps,
  AlertLinkProps,
  AlertProps,
  AlertTitleProps,
  AlertType,
  AlertVariant,
};
