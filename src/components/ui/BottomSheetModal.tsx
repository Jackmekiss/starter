import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps as GorhomBottomSheetBackdropProps,
  type BottomSheetBackgroundProps as GorhomBottomSheetBackgroundProps,
  BottomSheetHandle,
  type BottomSheetHandleProps,
  BottomSheetModal as BottomSheetModalComponent,
  BottomSheetModalProvider as GorhomBottomSheetModalProvider,
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
  registerPresentedSheet: (sheetId: string, dismiss: () => void) => void;
  unregisterPresentedSheet: (sheetId: string) => void;
}

/** Sheet entry kept in presentation order for Android hardware back. */
interface PresentedSheet {
  dismiss: () => void;
  id: string;
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
  const [presentedSheetCount, setPresentedSheetCount] = React.useState(0);

  /** Publishes the synchronous stack and its render-facing count together. */
  const publishPresentedSheets = React.useCallback(
    (nextSheets: PresentedSheet[]) => {
      presentedSheetsRef.current = nextSheets;
      setPresentedSheetCount((currentCount) =>
        currentCount === nextSheets.length ? currentCount : nextSheets.length,
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
    (sheetId: string, dismiss: () => void) => {
      const currentSheets = presentedSheetsRef.current;
      const existingIndex = currentSheets.findIndex(
        (sheet) => sheet.id === sheetId,
      );
      const existingSheet = currentSheets[existingIndex];

      if (
        existingIndex === currentSheets.length - 1 &&
        existingSheet?.dismiss === dismiss
      ) {
        subscribeBackHandler();
        return;
      }

      const nextSheets = [
        ...currentSheets.filter((sheet) => sheet.id !== sheetId),
        { dismiss, id: sheetId },
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
  const hasPresentedSheet = presentedSheetCount > 0;

  return (
    <BottomSheetAccessibilityContext.Provider value={contextValue}>
      <View
        accessibilityElementsHidden={hasPresentedSheet}
        aria-hidden={hasPresentedSheet}
        className={cn("flex-1", className)}
        importantForAccessibility={
          hasPresentedSheet ? "no-hide-descendants" : "auto"
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

/** Core props that tune shared bottom sheet content and behavior. */
interface BottomSheetModalBaseProps {
  children: React.ReactNode;
  ref: React.Ref<BottomSheetModalRef>;
  /** Localized name describing the modal surface. */
  contentAccessibilityLabel: string;
  contentClassName?: string;
  backgroundColor?: string;
  minHeight?: number;
  snapPoints?: (string | number)[];
  backdropOpacity?: number;
  onDismiss?: () => void;
  scrollable?: boolean;
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
  accessibilityViewIsModal = true,
  accessible = false,
  "aria-modal": ariaModal = true,
  children,
  className,
  importantForAccessibility = "yes",
  role = "dialog",
  ...props
}: BottomSheetModalContentProps) {
  return (
    <BottomSheetView
      accessibilityLabel={accessibilityLabel}
      accessibilityViewIsModal={accessibilityViewIsModal}
      accessible={accessible}
      aria-modal={ariaModal}
      className={cn(
        "gap-4 bg-background px-screen pb-safe-offset-6 pt-4",
        className,
      )}
      importantForAccessibility={importantForAccessibility}
      role={role}
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
  accessibilityViewIsModal = true,
  accessible = false,
  "aria-modal": ariaModal = true,
  children,
  className,
  contentContainerClassName,
  importantForAccessibility = "yes",
  role = "dialog",
  ...props
}: BottomSheetModalScrollContentProps) {
  return (
    <BottomSheetScrollView
      accessibilityLabel={accessibilityLabel}
      accessibilityViewIsModal={accessibilityViewIsModal}
      accessible={accessible}
      aria-modal={ariaModal}
      className={cn("bg-background", className)}
      contentContainerClassName={cn(
        "gap-4 px-screen pb-safe-offset-6 pt-4",
        contentContainerClassName,
      )}
      importantForAccessibility={importantForAccessibility}
      role={role}
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

/** Shared shadcn-style bottom sheet wrapper matching Fifteen geometry. */
function BottomSheetModal({
  backdropAccessibilityHint,
  backdropAccessibilityLabel,
  backdropOpacity = 0.6,
  backgroundColor,
  children,
  contentClassName,
  contentAccessibilityLabel,
  hasBackdrop = false,
  handleAccessibilityHint,
  handleAccessibilityLabel,
  minHeight = 300,
  onDismiss,
  ref,
  scrollable = false,
  showHandle = false,
  snapPoints,
}: BottomSheetModalProps) {
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

    registerPresentedSheet(sheetId, dismiss);

    try {
      modal.present();
    } catch (error) {
      unregisterPresentedSheet(sheetId);
      throw error;
    }
  }, [dismiss, registerPresentedSheet, sheetId, unregisterPresentedSheet]);

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
        pressBehavior="close"
      />
    ),
    [backdropAccessibilityHint, backdropAccessibilityLabel, backdropOpacity],
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
      {scrollable ? (
        <BottomSheetModalScrollContent
          accessibilityLabel={contentAccessibilityLabel}
          className={contentClassName}
          onAccessibilityEscape={handleAccessibilityEscape}
          style={{ minHeight }}
        >
          {children}
        </BottomSheetModalScrollContent>
      ) : (
        <BottomSheetModalContent
          accessibilityLabel={contentAccessibilityLabel}
          className={contentClassName}
          onAccessibilityEscape={handleAccessibilityEscape}
          style={{ minHeight }}
        >
          {children}
        </BottomSheetModalContent>
      )}
    </BottomSheetModalComponent>
  );
}

export {
  BottomSheetModal,
  BottomSheetModalContent,
  BottomSheetModalProvider,
  BottomSheetModalScrollContent,
};
export type { BottomSheetModalProps };
export default BottomSheetModal;
