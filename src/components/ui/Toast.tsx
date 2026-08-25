import { cva } from "class-variance-authority";
import {
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from "lucide-react-native";
import * as React from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import ToastMessage from "react-native-toast-message";

import { Icon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";
import type {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";

const DEFAULT_TOAST_DURATION = 4000;
const TOAST_HORIZONTAL_PADDING = 24;
const TOAST_TYPE = "design-system";

const toastIcons = {
  error: CircleX,
  info: Info,
  muted: CircleQuestionMark,
  success: CircleCheck,
  warning: TriangleAlert,
} as const;

/** Semantic purposes supported by the Toast primitive. */
type ToastActionType = keyof typeof toastIcons;

/** Surface treatments supported by the Toast primitive. */
type ToastVariant = "outline" | "solid";

const toastVariants = cva(
  "flex-row items-start gap-4 rounded-2xl px-4 py-3 shadow-lg shadow-black/10",
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
        outline: "bg-background",
        solid: "border",
      },
    },
    compoundVariants: [
      {
        action: "error",
        variant: "solid",
        className: "border-destructive-emphasis bg-destructive-soft",
      },
      {
        action: "info",
        variant: "solid",
        className: "border-info-emphasis bg-info-soft",
      },
      {
        action: "muted",
        variant: "solid",
        className: "border-border-emphasis bg-muted",
      },
      {
        action: "success",
        variant: "solid",
        className: "border-success-emphasis bg-success-soft",
      },
      {
        action: "warning",
        variant: "solid",
        className: "border-warning-emphasis bg-warning-soft",
      },
    ],
    defaultVariants: {
      action: "muted",
      variant: "outline",
    },
  },
);

const toastForegroundVariants = cva("", {
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
      className: "text-border-emphasis",
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

const toastDescriptionVariants = cva("", {
  variants: {
    action: {
      error: "",
      info: "",
      muted: "",
      success: "",
      warning: "",
    },
    variant: {
      outline: "text-secondary-foreground",
      solid: "",
    },
  },
  compoundVariants: [
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

const toastActionForegroundVariants = cva("", {
  variants: {
    action: {
      error: "text-destructive-emphasis",
      info: "text-info-emphasis",
      muted: "text-border-emphasis",
      success: "text-success-emphasis",
      warning: "text-warning-emphasis",
    },
  },
  defaultVariants: {
    action: "muted",
  },
});

/** Styling values inherited by Toast compound components. */
interface ToastStyleContextValue {
  /** Semantic purpose of the Toast. */
  action: ToastActionType;
  /** Surface treatment of the Toast. */
  variant: ToastVariant;
}

const ToastStyleContext = React.createContext<ToastStyleContextValue>({
  action: "muted",
  variant: "outline",
});

/** Props accepted by the Toast surface. */
interface ToastProps extends ComponentProps<typeof View> {
  /** Semantic purpose controlling icon and color. */
  action?: ToastActionType;
  /** Outline or softly filled surface treatment. */
  variant?: ToastVariant;
}

/** Props accepted by the Toast content row. */
type ToastContentProps = ComponentProps<typeof View>;

/** Props accepted by the Toast text column. */
type ToastTextProps = ComponentProps<typeof View>;

/** Props accepted by the Toast title. */
type ToastTitleProps = ComponentProps<typeof Text>;

/** Props accepted by the Toast description. */
type ToastDescriptionProps = ComponentProps<typeof Text>;

/** Props accepted by the semantic Toast icon. */
interface ToastIconProps extends Omit<ComponentProps<typeof Icon>, "as"> {
  /** Overrides the action inherited from the Toast. */
  action?: ToastActionType;
  /** Overrides the default icon selected for the action. */
  as?: ComponentProps<typeof Icon>["as"];
}

/** Props accepted by the Toast action link. */
type ToastActionProps = ComponentProps<typeof Link>;

/** Props accepted by the Toast close action. */
interface ToastCloseButtonProps extends Omit<
  ComponentProps<typeof Pressable>,
  "accessibilityLabel"
> {
  /** Localized name describing the close action. */
  accessibilityLabel: string;
}

/** Data passed through react-native-toast-message's custom renderer. */
interface ToastPayload {
  /** Semantic purpose of the Toast. */
  action: ToastActionType;
  /** Optional localized accessible name for the visible action. */
  actionAccessibilityLabel?: string;
  /** Optional visible action copy. */
  actionLabel?: string;
  /** Additional classes applied to the Toast surface. */
  className?: string;
  /** Localized name describing the close action. */
  closeAccessibilityLabel: string;
  /** Runs the optional visible action. */
  onActionPress?: () => void;
  /** Whether the close affordance is visible. */
  showClose: boolean;
  /** Surface treatment of the Toast. */
  variant: ToastVariant;
}

/** Options accepted by the public design-system Toast API. */
interface ShowToastOptions extends Omit<ToastPayload, "showClose" | "variant"> {
  /** Auto-dismiss duration in milliseconds. */
  duration?: number;
  /** Localized supporting copy displayed by the Toast. */
  description: string;
  /** Whether the close affordance is visible. */
  showClose?: boolean;
  /** Optional localized title displayed above the description. */
  title?: string;
  /** Surface treatment of the Toast. */
  variant?: ToastVariant;
}

/** Props accepted by the fixed react-native-toast-message renderer. */
interface DesignSystemToastProps extends ToastPayload {
  /** Localized supporting copy displayed by the Toast. */
  description: string;
  /** Closes the current Toast. */
  onClose: () => void;
  /** Optional localized title displayed above the description. */
  title?: string;
}

/** Toast surface matching the Fifteen outline and solid treatments. */
const Toast = React.forwardRef<React.ComponentRef<typeof View>, ToastProps>(
  (
    { action = "muted", className, style, variant = "outline", ...props },
    ref,
  ) => {
    const { width } = useWindowDimensions();
    const maxWidth = Math.max(0, width - TOAST_HORIZONTAL_PADDING * 2);
    const contextValue = React.useMemo(
      () => ({ action, variant }),
      [action, variant],
    );

    return (
      <ToastStyleContext.Provider value={contextValue}>
        <View
          ref={ref}
          className={cn(toastVariants({ action, variant }), className)}
          style={[{ maxWidth, width: maxWidth }, style]}
          {...props}
        />
      </ToastStyleContext.Provider>
    );
  },
);

/** Horizontal row containing Toast icon, text, and optional close action. */
const ToastContent = React.forwardRef<
  React.ComponentRef<typeof View>,
  ToastContentProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("min-w-0 flex-1 flex-row items-start gap-2", className)}
    {...props}
  />
));

/** Flexible column for Toast title, description, and optional action. */
const ToastText = React.forwardRef<
  React.ComponentRef<typeof View>,
  ToastTextProps
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
));

/** Toast title following the parent semantic foreground. */
function ToastTitle({ className, ...props }: ToastTitleProps) {
  const { action, variant } = React.useContext(ToastStyleContext);

  return (
    <Text
      className={cn(
        "font-body-semibold text-base",
        toastForegroundVariants({ action, variant }),
        className,
      )}
      {...props}
    />
  );
}

/** Toast supporting copy following the parent semantic foreground. */
function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  const { action, variant } = React.useContext(ToastStyleContext);

  return (
    <Text
      className={cn(
        "text-sm",
        toastDescriptionVariants({ action, variant }),
        className,
      )}
      {...props}
    />
  );
}

/** Decorative icon selected from the parent Toast action. */
function ToastIcon({
  action: actionOverride,
  as,
  className,
  ...props
}: ToastIconProps) {
  const { action: parentAction } = React.useContext(ToastStyleContext);
  const action = actionOverride ?? parentAction;
  const ActionIcon = as ?? toastIcons[action];

  return (
    <Icon
      accessible={false}
      as={ActionIcon}
      className={cn(
        "mt-0.5 shrink-0",
        toastActionForegroundVariants({ action }),
        className,
      )}
      importantForAccessibility="no"
      size={20}
      {...props}
    />
  );
}

/** Optional interactive action following the parent Toast foreground. */
const ToastAction = React.forwardRef<
  React.ComponentRef<typeof Link>,
  ToastActionProps
>(({ textClassName, ...props }, ref) => (
  <Link ref={ref} textClassName={textClassName} {...props} />
));

/** Compact close action requiring caller-injected localized copy. */
const ToastCloseButton = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ToastCloseButtonProps
>(
  (
    { accessibilityLabel, accessibilityState, className, disabled, ...props },
    ref,
  ) => {
    const { action } = React.useContext(ToastStyleContext);
    const isDisabled = Boolean(disabled);

    return (
      <Pressable
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
        className={cn(
          "h-6 w-6 shrink-0 items-center justify-center",
          isDisabled && "opacity-50",
          className,
        )}
        disabled={isDisabled}
        hitSlop={8}
        {...props}
      >
        <Icon
          accessible={false}
          as={X}
          className={toastActionForegroundVariants({ action })}
          importantForAccessibility="no"
          size={15}
        />
      </Pressable>
    );
  },
);

/** Fixed Toast anatomy consumed by react-native-toast-message. */
function DesignSystemToast({
  action,
  actionAccessibilityLabel,
  actionLabel,
  className,
  closeAccessibilityLabel,
  description,
  onActionPress,
  onClose,
  showClose,
  title,
  variant,
}: DesignSystemToastProps) {
  const announcement = title ? `${title}. ${description}` : description;

  /** Runs the injected action and closes its Toast. */
  function handleActionPress() {
    onActionPress?.();
    onClose();
  }

  return (
    <Toast action={action} className={className} variant={variant}>
      <ToastContent>
        <ToastIcon />
        <ToastText>
          <View
            accessible
            accessibilityLabel={announcement}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {title ? (
              <ToastTitle accessible={false} importantForAccessibility="no">
                {title}
              </ToastTitle>
            ) : null}
            <ToastDescription accessible={false} importantForAccessibility="no">
              {description}
            </ToastDescription>
          </View>
          {actionLabel && onActionPress ? (
            <ToastAction
              accessibilityLabel={actionAccessibilityLabel}
              className="mt-1 self-start"
              onPress={handleActionPress}
            >
              {actionLabel}
            </ToastAction>
          ) : null}
        </ToastText>
        {showClose ? (
          <ToastCloseButton
            accessibilityLabel={closeAccessibilityLabel}
            onPress={onClose}
          />
        ) : null}
      </ToastContent>
    </Toast>
  );
}

/** Custom renderer registered on the application Toast host. */
function renderDesignSystemToast({
  hide,
  props,
  text1,
  text2,
}: ToastConfigParams<ToastPayload>) {
  return (
    <DesignSystemToast
      {...props}
      description={text2 ?? ""}
      onClose={hide}
      title={text1}
    />
  );
}

/** Host configuration used by the root application and Storybook preview. */
const toastConfig: ToastConfig = {
  [TOAST_TYPE]: renderDesignSystemToast,
};

/** Displays one design-system Toast through the mounted root host. */
function showToast({
  action,
  actionAccessibilityLabel,
  actionLabel,
  className,
  closeAccessibilityLabel,
  description,
  duration = DEFAULT_TOAST_DURATION,
  onActionPress,
  showClose = true,
  title,
  variant = "outline",
}: ShowToastOptions) {
  ToastMessage.show({
    position: "top",
    props: {
      action,
      actionAccessibilityLabel,
      actionLabel,
      className,
      closeAccessibilityLabel,
      onActionPress,
      showClose,
      variant,
    } satisfies ToastPayload,
    text1: title,
    text2: description,
    type: TOAST_TYPE,
    visibilityTime: duration,
  });
}

/** Closes the currently visible Toast. */
function closeToast() {
  ToastMessage.hide();
}

/** Restricted design-system Toast API for presentation code. */
function useToast() {
  return {
    close: closeToast,
    closeAll: closeToast,
    show: showToast,
  };
}

Toast.displayName = "Toast";
ToastAction.displayName = "ToastAction";
ToastCloseButton.displayName = "ToastCloseButton";
ToastContent.displayName = "ToastContent";
ToastText.displayName = "ToastText";

export {
  DesignSystemToast,
  Toast,
  ToastAction,
  ToastCloseButton,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastText,
  ToastTitle,
  toastConfig,
  toastDescriptionVariants,
  toastForegroundVariants,
  toastVariants,
  useToast,
};
export type {
  DesignSystemToastProps,
  ShowToastOptions,
  ToastActionType,
  ToastActionProps,
  ToastCloseButtonProps,
  ToastContentProps,
  ToastDescriptionProps,
  ToastIconProps,
  ToastProps,
  ToastTextProps,
  ToastTitleProps,
  ToastVariant,
};
