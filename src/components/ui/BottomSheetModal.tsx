import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal as BottomSheetModalComponent,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { styled } from "nativewind";
import React, { useCallback, useImperativeHandle, useRef } from "react";
import { useColorScheme } from "react-native";

import { resolveAppColorScheme, THEME } from "@/constants/theme";
import { cn } from "@/lib/cn";

const StyledBottomSheetModal = styled(BottomSheetModalComponent, {
  backgroundClassName: "backgroundStyle",
});

/**
 * Imperative controls exposed by the shared bottom sheet modal.
 */
export interface BottomSheetModalRef {
  /**
   * Opens the bottom sheet from parent-controlled flows.
   */
  present: () => void;

  /**
   * Closes the bottom sheet from parent-controlled flows.
   */
  dismiss: () => void;
}

/**
 * Props that tune shared bottom sheet content, sizing, and backdrop behavior.
 */
interface Props {
  children: React.ReactNode;
  ref: React.Ref<BottomSheetModalRef>;
  contentClassName?: string;
  backgroundColor?: string;
  minHeight?: number;
  snapPoints?: (string | number)[];
  backdropOpacity?: number;
}

/**
 * Shared bottom sheet wrapper with themed backdrop and safe-area spacing.
 */
function BottomSheetModal({
  children,
  ref,
  contentClassName,
  backgroundColor,
  minHeight = 300,
  snapPoints,
  backdropOpacity = 0.4,
}: Props) {
  const colorScheme = resolveAppColorScheme(useColorScheme());
  const theme = THEME[colorScheme];
  const bottomSheetModalRef =
    useRef<React.ComponentRef<typeof StyledBottomSheetModal>>(null);

  useImperativeHandle(
    ref,
    () => ({
      present: () => bottomSheetModalRef.current?.present(),
      dismiss: () => bottomSheetModalRef.current?.dismiss(),
    }),
    [],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={backdropOpacity}
      />
    ),
    [backdropOpacity],
  );

  return (
    <StyledBottomSheetModal
      ref={bottomSheetModalRef}
      backgroundClassName="bg-background rounded-t-full"
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      handleIndicatorStyle={{
        backgroundColor: theme.secondary,
        width: 60,
        marginVertical: 16,
      }}
      backgroundStyle={{ backgroundColor: backgroundColor ?? theme.background }}
    >
      <BottomSheetView
        className={cn(
          "gap-4 bg-background px-safe pb-safe-offset-1 pt-4",
          contentClassName,
        )}
        style={{ minHeight }}
      >
        {children}
      </BottomSheetView>
    </StyledBottomSheetModal>
  );
}

export default BottomSheetModal;
