import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal as BottomSheetModalComponent,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useImperativeHandle, useRef } from "react";

import { THEME } from "@/constants/theme";
import { cn } from "@/lib/cn";

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
  backgroundColor = THEME.light.background,
  minHeight = 300,
  snapPoints,
  backdropOpacity = 0.4,
}: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModalComponent>(null);

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
    <BottomSheetModalComponent
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      handleIndicatorStyle={{
        backgroundColor: THEME.light.secondary,
        width: 60,
        marginVertical: 16,
      }}
      // @ts-ignore
      className="rounded-t-full bg-background"
      backgroundStyle={{ backgroundColor }}
    >
      <BottomSheetView
        className={cn(
          "gap-4 bg-background px-safe-horizontal pb-safe-4 pt-4",
          contentClassName,
        )}
        style={{ minHeight }}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModalComponent>
  );
}

export default BottomSheetModal;
