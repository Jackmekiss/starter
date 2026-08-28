import BottomSheetComponent, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps as GorhomBottomSheetBackdropProps,
  type BottomSheetBackgroundProps as GorhomBottomSheetBackgroundProps,
  BottomSheetHandle,
  type BottomSheetHandleProps,
  BottomSheetModal as BottomSheetModalComponent,
  BottomSheetModalProvider as GorhomBottomSheetModalProvider,
  type BottomSheetProps as GorhomBottomSheetProps,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "expo-router";
import * as React from "react";
import {
  BackHandler,
  Platform,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { THEME } from "@/constants/theme";
import { cn } from "@/lib/cn";

/** Accessibility state shared by the application sibling and portaled sheets. */
interface BottomSheetAccessibilityContextValue {
  registerPresentedSheet: (
    sheetId: string,
    dismiss: () => void,
    isModal: boolean,
  ) => void;
  unregisterPresentedSheet: (sheetId: string) => void;
}

/** Sheet entry kept in presentation order for Android hardware back. */
interface PresentedSheet {
  dismiss: () => void;
  id: string;
  isModal: boolean;
}

const BottomSheetAccessibilityContext = React.createContext<
  BottomSheetAccessibilityContextValue | undefined
>(undefined);

/** Props accepted by the bottom-sheet background accessibility guard. */
interface BottomSheetAccessibilityProviderProps
  extends React.PropsWithChildren {
  className?: string;
}

/** Hides application siblings from assistive technology while a sheet is open. */
function BottomSheetAccessibilityProvider({
  children,
  className,
}: BottomSheetAccessibilityProviderProps) {
  const presentedSheetsRef = React.useRef<PresentedSheet[]>([]);
  const backSubscriptionRef = React.useRef<ReturnType<
    typeof BackHandler.addEventListener
  > | null>(null);
  const [presentedModalCount, setPresentedModalCount] = React.useState(0);

  /** Publishes the synchronous stack and its render-facing count together. */
  const publishPresentedSheets = React.useCallback(
    (nextSheets: PresentedSheet[]) => {
      presentedSheetsRef.current = nextSheets;
      const nextModalCount = nextSheets.filter((sheet) => sheet.isModal).length;
      setPresentedModalCount((currentCount) =>
        currentCount === nextModalCount ? currentCount : nextModalCount,
      );
    },
    [],
  );

  /** Dismisses only the topmost presented sheet on Android hardware back. */
  const handleHardwareBackPress = React.useCallback(() => {
    const topSheet = presentedSheetsRef.current.at(-1);

    if (topSheet === undefined) {
      return false;
    }

    topSheet.dismiss();
    return true;
  }, []);

  /** Subscribes after the router so the active modal gets first refusal. */
  const subscribeBackHandler = React.useCallback(() => {
    if (Platform.OS !== "android" || backSubscriptionRef.current !== null) {
      return;
    }

    backSubscriptionRef.current = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress,
    );
  }, [handleHardwareBackPress]);

  /** Removes the modal back handler when no sheet remains. */
  const unsubscribeBackHandler = React.useCallback(() => {
    backSubscriptionRef.current?.remove();
    backSubscriptionRef.current = null;
  }, []);

  const registerPresentedSheet = React.useCallback(
    (sheetId: string, dismiss: () => void, isModal: boolean) => {
      const currentSheets = presentedSheetsRef.current;
      const existingIndex = currentSheets.findIndex(
        (sheet) => sheet.id === sheetId,
      );
      const existingSheet = currentSheets[existingIndex];

      if (
        existingIndex === currentSheets.length - 1 &&
        existingSheet?.dismiss === dismiss &&
        existingSheet.isModal === isModal
      ) {
        subscribeBackHandler();
        return;
      }

      const nextSheets = [
        ...currentSheets.filter((sheet) => sheet.id !== sheetId),
        { dismiss, id: sheetId, isModal },
      ];
      publishPresentedSheets(nextSheets);
      subscribeBackHandler();
    },
    [publishPresentedSheets, subscribeBackHandler],
  );

  const unregisterPresentedSheet = React.useCallback(
    (sheetId: string) => {
      const currentSheets = presentedSheetsRef.current;

      if (!currentSheets.some((sheet) => sheet.id === sheetId)) {
        return;
      }

      const nextSheets = currentSheets.filter((sheet) => sheet.id !== sheetId);
      publishPresentedSheets(nextSheets);

      if (nextSheets.length === 0) {
        unsubscribeBackHandler();
      }
    },
    [publishPresentedSheets, unsubscribeBackHandler],
  );

  React.useEffect(
    () => () => {
      unsubscribeBackHandler();
    },
    [unsubscribeBackHandler],
  );

  const contextValue = React.useMemo(
    () => ({ registerPresentedSheet, unregisterPresentedSheet }),
    [registerPresentedSheet, unregisterPresentedSheet],
  );
  const hasPresentedModal = presentedModalCount > 0;

  return (
    <BottomSheetAccessibilityContext.Provider value={contextValue}>
      <View
        accessibilityElementsHidden={hasPresentedModal}
        aria-hidden={hasPresentedModal}
        className={cn("flex-1", className)}
        importantForAccessibility={
          hasPresentedModal ? "no-hide-descendants" : "auto"
        }
      >
        {children}
      </View>
    </BottomSheetAccessibilityContext.Provider>
  );
}

/** Mounts Gorhom's portal host outside the guarded application sibling. */
function BottomSheetModalProvider({ children }: React.PropsWithChildren) {
  return (
    <GorhomBottomSheetModalProvider>
      <BottomSheetAccessibilityProvider>
        {children}
      </BottomSheetAccessibilityProvider>
    </GorhomBottomSheetModalProvider>
  );
}

/** Returns the required accessibility coordinator mounted by the app shell. */
function useBottomSheetAccessibility() {
  const context = React.useContext(BottomSheetAccessibilityContext);

  if (context === undefined) {
    throw new Error(
      "BottomSheetModal must be rendered inside BottomSheetModalProvider.",
    );
  }

  return context;
}

/** Imperative controls exposed by the shared bottom sheet modal. */
export interface BottomSheetModalRef {
  /** Opens the bottom sheet from parent-controlled flows. */
  present: () => void;
  /** Closes the bottom sheet from parent-controlled flows. */
  dismiss: () => void;
}

/** Imperative ref exposed by an in-tree persistent bottom sheet. */
export type BottomSheetPersistentRef = React.ElementRef<
  typeof BottomSheetComponent
>;

/** Imperative ref exposed by the unified bottom sheet primitive. */
export type BottomSheetRef = BottomSheetPersistentRef | BottomSheetModalRef;

/** Behaviors supported by the unified bottom sheet primitive. */
export type BottomSheetVariant = "persistent" | "nonModal" | "modal";

/** Shared content props used by every bottom sheet variant. */
interface BottomSheetContentBaseProps {
  children: React.ReactNode;
  /** Localized name describing the modal surface. */
  contentAccessibilityLabel: string;
  contentClassName?: string;
  minHeight?: number;
  scrollable?: boolean;
}

/** Core props that tune shared closable bottom sheet content and behavior. */
interface BottomSheetModalBaseProps extends BottomSheetContentBaseProps {
  ref?: React.Ref<BottomSheetModalRef>;
  backgroundColor?: string;
  snapPoints?: (string | number)[];
  backdropOpacity?: number;
  dismissOnBackdropPress?: boolean;
  enablePanDownToClose?: boolean;
  onDismiss?: () => void;
}

/** Requires localized backdrop copy exactly when a backdrop is rendered. */
type BottomSheetBackdropAccessibility =
  | {
      backdropAccessibilityHint?: never;
      backdropAccessibilityLabel?: never;
      hasBackdrop?: false;
    }
  | {
      /** Localized instruction announced for the dismissing backdrop. */
      backdropAccessibilityHint: string;
      /** Localized name announced for the dismissing backdrop. */
      backdropAccessibilityLabel: string;
      hasBackdrop: true;
    };

/** Requires localized handle copy exactly when the gesture handle is visible. */
type BottomSheetHandleAccessibility =
  | {
      handleAccessibilityHint?: never;
      handleAccessibilityLabel?: never;
      showHandle?: false;
    }
  | {
      /** Localized instruction announced for the adjustable handle. */
      handleAccessibilityHint: string;
      /** Localized name announced for the adjustable handle. */
      handleAccessibilityLabel: string;
      showHandle: true;
    };

/** Props that tune shared bottom sheet content and behavior. */
type BottomSheetModalProps = BottomSheetModalBaseProps &
  BottomSheetBackdropAccessibility &
  BottomSheetHandleAccessibility;

/** Props accepted by an always-visible, non-interactive sheet. */
export type BottomSheetPersistentProps = Omit<
  GorhomBottomSheetProps,
  | "backdropComponent"
  | "backgroundComponent"
  | "children"
  | "enableContentPanningGesture"
  | "enableHandlePanningGesture"
  | "enableOverDrag"
  | "enablePanDownToClose"
  | "handleComponent"
  | "handleIndicatorStyle"
> &
  BottomSheetContentBaseProps & {
    ref?: React.Ref<BottomSheetPersistentRef>;
    variant: "persistent";
  };

/** Props accepted by a closable sheet that leaves the background interactive. */
export type BottomSheetNonModalProps = Omit<
  BottomSheetModalBaseProps,
  "backdropOpacity" | "dismissOnBackdropPress"
> & {
  backdropAccessibilityHint?: never;
  backdropAccessibilityLabel?: never;
  handleAccessibilityHint: string;
  handleAccessibilityLabel: string;
  hasBackdrop?: never;
  showHandle?: never;
  variant: "nonModal";
};

/** Props accepted by a modal sheet with a blocking dismissible backdrop. */
export type BottomSheetModalVariantProps = BottomSheetModalBaseProps & {
  backdropAccessibilityHint: string;
  backdropAccessibilityLabel: string;
  handleAccessibilityHint?: never;
  handleAccessibilityLabel?: never;
  hasBackdrop?: never;
  showHandle?: never;
  variant: "modal";
};

/** Props accepted by either closable bottom sheet variant. */
export type BottomSheetClosableProps =
  | BottomSheetNonModalProps
  | BottomSheetModalVariantProps;

/** Props accepted by the unified bottom sheet primitive. */
export type BottomSheetProps =
  | BottomSheetPersistentProps
  | BottomSheetClosableProps;

/** Static bottom-sheet content with the shared screen gutters. */
interface BottomSheetModalContentProps extends Pick<
  ViewProps,
  | "accessibilityViewIsModal"
  | "accessibilityLabel"
  | "accessible"
  | "aria-modal"
  | "children"
  | "importantForAccessibility"
  | "onAccessibilityEscape"
  | "role"
> {
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/** Static bottom-sheet content with the shared screen gutters. */
function BottomSheetModalContent({
  accessibilityLabel,
  accessibilityViewIsModal,
  accessible = false,
  "aria-modal": ariaModal,
  children,
  className,
  importantForAccessibility,
  role,
  ...props
}: BottomSheetModalContentProps) {
  const resolvedAccessibilityViewIsModal = accessibilityViewIsModal ?? true;

  return (
    <BottomSheetView
      accessibilityLabel={accessibilityLabel}
      accessibilityViewIsModal={resolvedAccessibilityViewIsModal}
      accessible={accessible}
      aria-modal={ariaModal ?? resolvedAccessibilityViewIsModal}
      className={cn(
        "gap-4 bg-background px-screen pb-safe-offset-6 pt-4",
        className,
      )}
      importantForAccessibility={
        importantForAccessibility ??
        (resolvedAccessibilityViewIsModal ? "yes" : "auto")
      }
      role={role ?? (resolvedAccessibilityViewIsModal ? "dialog" : undefined)}
      {...props}
    >
      {children}
    </BottomSheetView>
  );
}

/** Props accepted by scrollable bottom-sheet content. */
interface BottomSheetModalScrollContentProps extends BottomSheetModalContentProps {
  contentContainerClassName?: string;
}

/** Scrollable bottom-sheet content with shared safe-area padding. */
function BottomSheetModalScrollContent({
  accessibilityLabel,
  accessibilityViewIsModal,
  accessible = false,
  "aria-modal": ariaModal,
  children,
  className,
  contentContainerClassName,
  importantForAccessibility,
  role,
  ...props
}: BottomSheetModalScrollContentProps) {
  const resolvedAccessibilityViewIsModal = accessibilityViewIsModal ?? true;

  return (
    <BottomSheetScrollView
      accessibilityLabel={accessibilityLabel}
      accessibilityViewIsModal={resolvedAccessibilityViewIsModal}
      accessible={accessible}
      aria-modal={ariaModal ?? resolvedAccessibilityViewIsModal}
      className={cn("bg-background", className)}
      contentContainerClassName={cn(
        "gap-4 px-screen pb-safe-offset-6 pt-4",
        contentContainerClassName,
      )}
      importantForAccessibility={
        importantForAccessibility ??
        (resolvedAccessibilityViewIsModal ? "yes" : "auto")
      }
      role={role ?? (resolvedAccessibilityViewIsModal ? "dialog" : undefined)}
      {...props}
    >
      {children}
    </BottomSheetScrollView>
  );
}

/** Removes Gorhom's default handle while preserving its layout contract. */
function EmptyHandle() {
  return null;
}

/** Decorative sheet surface without Gorhom's hard-coded adjustable semantics. */
function BottomSheetBackground({
  pointerEvents,
  style,
}: GorhomBottomSheetBackgroundProps) {
  return (
    <View
      accessible={false}
      className="bg-background border-border rounded-t-3xl border"
      pointerEvents={pointerEvents}
      style={style}
    />
  );
}

/** Shared content frame used by all three bottom sheet behaviors. */
function BottomSheetContentFrame({
  children,
  contentAccessibilityLabel,
  contentClassName,
  isModal,
  minHeight,
  onAccessibilityEscape,
  scrollable = false,
}: BottomSheetContentBaseProps & {
  isModal: boolean;
  onAccessibilityEscape?: () => void;
}) {
  const accessibilityProps = {
    accessibilityViewIsModal: isModal,
    "aria-modal": isModal,
    importantForAccessibility: isModal ? ("yes" as const) : ("auto" as const),
    onAccessibilityEscape,
    role: isModal ? ("dialog" as const) : undefined,
    style: minHeight === undefined ? undefined : { minHeight },
  };

  return scrollable ? (
    <BottomSheetModalScrollContent
      {...accessibilityProps}
      accessibilityLabel={contentAccessibilityLabel}
      className={contentClassName}
    >
      {children}
    </BottomSheetModalScrollContent>
  ) : (
    <BottomSheetModalContent
      {...accessibilityProps}
      accessibilityLabel={contentAccessibilityLabel}
      className={contentClassName}
    >
      {children}
    </BottomSheetModalContent>
  );
}

/** Renders an always-visible sheet inside the current screen hierarchy. */
function PersistentBottomSheet({
  backgroundStyle,
  children,
  contentAccessibilityLabel,
  contentClassName,
  minHeight,
  ref,
  scrollable,
  style,
  ...props
}: Omit<BottomSheetPersistentProps, "variant">) {
  return (
    <BottomSheetComponent
      ref={ref}
      {...props}
      accessible={false}
      backgroundComponent={BottomSheetBackground}
      backgroundStyle={backgroundStyle}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableOverDrag={false}
      enablePanDownToClose={false}
      handleComponent={EmptyHandle}
      style={style}
    >
      <BottomSheetContentFrame
        contentAccessibilityLabel={contentAccessibilityLabel}
        contentClassName={contentClassName}
        isModal={false}
        minHeight={minHeight}
        scrollable={scrollable}
      >
        {children}
      </BottomSheetContentFrame>
    </BottomSheetComponent>
  );
}

/** Shared closable bottom sheet wrapper using the application geometry. */
function ClosableBottomSheet({
  backdropAccessibilityHint,
  backdropAccessibilityLabel,
  backdropOpacity = 0.6,
  backgroundColor,
  children,
  contentClassName,
  contentAccessibilityLabel,
  dismissOnBackdropPress = true,
  enablePanDownToClose,
  hasBackdrop = false,
  handleAccessibilityHint,
  handleAccessibilityLabel,
  isModal,
  minHeight = 300,
  onDismiss,
  ref,
  scrollable = false,
  showHandle = false,
  snapPoints,
}: BottomSheetModalProps & { isModal: boolean }) {
  const theme = THEME[useTheme().dark ? "dark" : "light"];
  const { registerPresentedSheet, unregisterPresentedSheet } =
    useBottomSheetAccessibility();
  const sheetId = React.useId();
  const bottomSheetModalRef =
    React.useRef<React.ComponentRef<typeof BottomSheetModalComponent>>(null);

  /** Requests dismissal through the same path for every close affordance. */
  const dismiss = React.useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  /** Presents the sheet after synchronously hiding background accessibility. */
  const present = React.useCallback(() => {
    const modal = bottomSheetModalRef.current;

    if (modal === null) {
      return;
    }

    registerPresentedSheet(sheetId, dismiss, isModal);

    try {
      modal.present();
    } catch (error) {
      unregisterPresentedSheet(sheetId);
      throw error;
    }
  }, [
    dismiss,
    isModal,
    registerPresentedSheet,
    sheetId,
    unregisterPresentedSheet,
  ]);

  React.useImperativeHandle(
    ref,
    () => ({
      present,
      dismiss,
    }),
    [dismiss, present],
  );

  React.useEffect(
    () => () => {
      unregisterPresentedSheet(sheetId);
    },
    [sheetId, unregisterPresentedSheet],
  );

  const renderBackdrop = React.useCallback(
    (props: GorhomBottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        accessibilityHint={backdropAccessibilityHint}
        accessibilityLabel={backdropAccessibilityLabel}
        accessibilityRole="button"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={backdropOpacity}
        pressBehavior={dismissOnBackdropPress ? "close" : "none"}
      />
    ),
    [
      backdropAccessibilityHint,
      backdropAccessibilityLabel,
      backdropOpacity,
      dismissOnBackdropPress,
    ],
  );

  const renderHandle = React.useCallback(
    (props: BottomSheetHandleProps) => (
      <BottomSheetHandle
        {...props}
        accessibilityHint={handleAccessibilityHint}
        accessibilityLabel={handleAccessibilityLabel}
      />
    ),
    [handleAccessibilityHint, handleAccessibilityLabel],
  );

  /** Dismisses the sheet for VoiceOver's escape gesture. */
  const handleAccessibilityEscape = dismiss;

  /** Restores background traversal after every dismissal path completes. */
  const handleDismiss = React.useCallback(() => {
    unregisterPresentedSheet(sheetId);
    onDismiss?.();
  }, [onDismiss, sheetId, unregisterPresentedSheet]);

  return (
    <BottomSheetModalComponent
      ref={bottomSheetModalRef}
      accessibilityLabel={null}
      accessibilityRole={null}
      accessible={false}
      backdropComponent={hasBackdrop ? renderBackdrop : undefined}
      backgroundComponent={BottomSheetBackground}
      backgroundStyle={{ backgroundColor: backgroundColor ?? theme.background }}
      enableDismissOnClose
      enablePanDownToClose={enablePanDownToClose}
      handleComponent={showHandle ? renderHandle : EmptyHandle}
      handleIndicatorStyle={{
        backgroundColor: theme.mutedForeground,
        marginVertical: 12,
        width: 48,
      }}
      onDismiss={handleDismiss}
      snapPoints={snapPoints}
      stackBehavior="replace"
    >
      <BottomSheetContentFrame
        contentAccessibilityLabel={contentAccessibilityLabel}
        contentClassName={contentClassName}
        isModal={isModal}
        minHeight={minHeight}
        onAccessibilityEscape={handleAccessibilityEscape}
        scrollable={scrollable}
      >
        {children}
      </BottomSheetContentFrame>
    </BottomSheetModalComponent>
  );
}

/** Unified bottom sheet primitive with Fifteen-aligned behavioral variants. */
function BottomSheet(props: BottomSheetProps) {
  if (props.variant === "persistent") {
    const { variant: _variant, ...persistentProps } = props;

    return <PersistentBottomSheet {...persistentProps} />;
  }

  if (props.variant === "nonModal") {
    const { enablePanDownToClose, variant: _variant, ...closableProps } = props;

    return (
      <ClosableBottomSheet
        {...closableProps}
        enablePanDownToClose={enablePanDownToClose ?? true}
        hasBackdrop={false}
        isModal={false}
        showHandle
      />
    );
  }

  const {
    dismissOnBackdropPress,
    enablePanDownToClose,
    variant: _variant,
    ...closableProps
  } = props;

  return (
    <ClosableBottomSheet
      {...closableProps}
      dismissOnBackdropPress={dismissOnBackdropPress ?? true}
      enablePanDownToClose={enablePanDownToClose ?? false}
      hasBackdrop
      isModal
      showHandle={false}
    />
  );
}

/** Backward-compatible modal primitive for existing Starter call sites. */
function BottomSheetModal(props: BottomSheetModalProps) {
  return <ClosableBottomSheet {...props} isModal />;
}

/** Canonical content export shared by every bottom sheet variant. */
const BottomSheetContent = BottomSheetModalContent;
/** Canonical scroll content export shared by every bottom sheet variant. */
const BottomSheetScrollContent = BottomSheetModalScrollContent;
/** Props accepted by canonical static bottom sheet content. */
type BottomSheetContentProps = BottomSheetModalContentProps;
/** Props accepted by canonical scrollable bottom sheet content. */
type BottomSheetScrollContentProps = BottomSheetModalScrollContentProps;

export {
  BottomSheet,
  BottomSheetContent,
  BottomSheetScrollContent,
  BottomSheetModal,
  BottomSheetModalContent,
  BottomSheetModalProvider,
  BottomSheetModalScrollContent,
};
export type {
  BottomSheetContentProps,
  BottomSheetModalContentProps,
  BottomSheetModalProps,
  BottomSheetModalScrollContentProps,
  BottomSheetScrollContentProps,
};
export default BottomSheetModal;
