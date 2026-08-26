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
import { Animated, Pressable, useWindowDimensions, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Link";
import { SafeAreaView } from "@/components/ui/SafeAreaView";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

const DEFAULT_TOAST_DURATION = 4000;
const TOAST_ANIMATION_DURATION = 150;
const TOAST_HORIZONTAL_PADDING = 24;
const TOAST_INITIAL_TRANSLATE_Y = -24;

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

/** Options accepted by the public design-system Toast API. */
interface ShowToastOptions {
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

/** Props accepted by the fixed design-system Toast renderer. */
interface DesignSystemToastProps extends ShowToastOptions {
  /** Localized supporting copy displayed by the Toast. */
  description: string;
  /** Optional host identity used by native automation. */
  id?: string | number;
  /** Closes the current Toast. */
  onClose: () => void;
  /** Optional localized title displayed above the description. */
  title?: string;
}

/** Toast surface with the canonical outline and solid treatments. */
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
          "h-11 w-11 shrink-0 items-center justify-center",
          isDisabled && "opacity-50",
          className,
        )}
        disabled={isDisabled}
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

/** Fixed Toast anatomy consumed by the local Toast host. */
function DesignSystemToast({
  action,
  actionAccessibilityLabel,
  actionLabel,
  className,
  closeAccessibilityLabel,
  description,
  id,
  onActionPress,
  onClose,
  showClose = true,
  title,
  variant = "outline",
}: DesignSystemToastProps) {
  const announcement = title ? `${title}. ${description}` : description;

  /** Runs the injected action and closes its Toast. */
  function handleActionPress() {
    onActionPress?.();
    onClose();
  }

  return (
    <Toast
      action={action}
      className={className}
      nativeID={id === undefined ? undefined : `toast-${id}`}
      variant={variant}
    >
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

/** One Toast managed by the local host. */
interface ToastInstance extends ShowToastOptions {
  id: number;
  visible: boolean;
}

/** API shared between the Toast provider and consumers. */
interface ToastContextValue {
  /** Starts the exit animation for one Toast. */
  close(id: string | number): void;
  /** Starts the exit animation for every active Toast. */
  closeAll(): void;
  /** Reports whether a Toast is still visibly active. */
  isActive(id: string | number): boolean;
  /** Adds one Toast to the stack and returns its identity. */
  show(options: ShowToastOptions): number;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/** Props accepted by the application Toast provider. */
interface ToastProviderProps {
  children?: React.ReactNode;
}

/** Props accepted by one animated host item. */
interface ToastHostItemProps {
  toast: ToastInstance;
  /** Requests dismissal of the hosted Toast. */
  onClose(id: number): void;
  /** Removes the hosted Toast after its exit completes. */
  onExited(id: number): void;
}

/** Animates one Toast and removes it only after its exit completes. */
function ToastHostItem({ toast, onClose, onExited }: ToastHostItemProps) {
  const [opacity] = React.useState(() => new Animated.Value(0));
  const [translateY] = React.useState(
    () => new Animated.Value(TOAST_INITIAL_TRANSLATE_Y),
  );

  React.useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        duration: TOAST_ANIMATION_DURATION,
        toValue: toast.visible ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: TOAST_ANIMATION_DURATION,
        toValue: toast.visible ? 0 : TOAST_INITIAL_TRANSLATE_Y,
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished && !toast.visible) onExited(toast.id);
    });

    return () => animation.stop();
  }, [onExited, opacity, toast.id, toast.visible, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <DesignSystemToast {...toast} onClose={() => onClose(toast.id)} />
    </Animated.View>
  );
}

/** Hosts a stack of transient Toasts without leaving an inactive overlay. */
function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastInstance[]>([]);
  const nextIdRef = React.useRef(0);
  const timersRef = React.useRef(
    new Map<number, ReturnType<typeof setTimeout>>(),
  );

  const close = React.useCallback((id: string | number) => {
    const numericId = typeof id === "number" ? id : Number(id);
    const timer = timersRef.current.get(numericId);

    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(numericId);
    }

    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === numericId ? { ...toast, visible: false } : toast,
      ),
    );
  }, []);

  const closeAll = React.useCallback(() => {
    for (const timer of timersRef.current.values()) clearTimeout(timer);
    timersRef.current.clear();
    setToasts((currentToasts) =>
      currentToasts.map((toast) => ({ ...toast, visible: false })),
    );
  }, []);

  const remove = React.useCallback((id: number) => {
    timersRef.current.delete(id);
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const show = React.useCallback(
    (options: ShowToastOptions) => {
      const id = nextIdRef.current;
      nextIdRef.current += 1;
      const duration = options.duration ?? DEFAULT_TOAST_DURATION;

      setToasts((currentToasts) => [
        ...currentToasts,
        { ...options, duration, id, visible: true },
      ]);

      if (duration > 0) {
        const timer = setTimeout(() => close(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [close],
  );

  const isActive = React.useCallback(
    (id: string | number) => {
      const numericId = typeof id === "number" ? id : Number(id);
      return toasts.some((toast) => toast.id === numericId && toast.visible);
    },
    [toasts],
  );

  React.useEffect(
    () => () => {
      for (const timer of timersRef.current.values()) clearTimeout(timer);
      timersRef.current.clear();
    },
    [],
  );

  const value = React.useMemo(
    () => ({ close, closeAll, isActive, show }),
    [close, closeAll, isActive, show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 ? (
        <View
          accessible={false}
          className="absolute inset-x-0 top-0 z-50 items-center px-6"
          pointerEvents="box-none"
        >
          <SafeAreaView
            accessible={false}
            className="w-full items-center gap-2"
            edges={["top"]}
            pointerEvents="box-none"
          >
            {toasts.map((toast) => (
              <ToastHostItem
                key={toast.id}
                onClose={close}
                onExited={remove}
                toast={toast}
              />
            ))}
          </SafeAreaView>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

/** Restricted design-system Toast API for presentation code. */
function useToast() {
  const toast = React.useContext(ToastContext);

  if (toast === null) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return toast;
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
  ToastProvider,
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
  ToastProviderProps,
  ToastTextProps,
  ToastTitleProps,
  ToastVariant,
};
