import { createRef, useRef } from "react";
import { View } from "react-native";

import {
  BottomSheetModal,
  type BottomSheetModalRef,
} from "@/components/ui/BottomSheetModal";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps } from "react";

const scrollItems = [
  "Account details",
  "Notification preferences",
  "Privacy controls",
  "Connected services",
  "Billing details",
  "Security settings",
  "Language",
  "Appearance",
] as const;

const meta = {
  title: "UI/BottomSheetModal",
  component: BottomSheetModal,
  args: {
    backdropAccessibilityHint: "Closes the bottom sheet",
    backdropAccessibilityLabel: "Close bottom sheet",
    children: null,
    contentAccessibilityLabel: "Bottom sheet content",
    hasBackdrop: true,
    handleAccessibilityHint: "Swipe to resize the bottom sheet",
    handleAccessibilityLabel: "Bottom sheet handle",
    ref: createRef<BottomSheetModalRef>(),
    showHandle: true,
    snapPoints: ["40%"],
  },
  render: BottomSheetModalStory,
} satisfies Meta<typeof BottomSheetModal>;

export default meta;

/** Story type inferred from the bottom sheet metadata. */
type Story = StoryObj<typeof meta>;

/** Presentable bottom sheet with themed content. */
export const Basic: Story = {};

/** Scrollable bottom sheet with longer content. */
export const Scrollable: Story = {
  args: {
    scrollable: true,
    snapPoints: ["65%"],
  },
  render: BottomSheetScrollableStory,
};

/** Renders a button that presents the shared bottom sheet. */
function BottomSheetModalStory(
  bottomSheetProps: ComponentProps<typeof BottomSheetModal>,
) {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  /** Opens the bottom sheet from the story canvas. */
  function handleOpenPress() {
    bottomSheetRef.current?.present();
  }

  return (
    <View className="flex-1 items-start">
      <Button onPress={handleOpenPress}>
        <Text>Open bottom sheet</Text>
      </Button>
      <BottomSheetModal {...bottomSheetProps} ref={bottomSheetRef}>
        <View className="gap-2">
          <Text variant="h3">Bottom sheet</Text>
          <Text variant="muted">
            Shared presentation providers are available without application
            state or runtime wiring.
          </Text>
        </View>
      </BottomSheetModal>
    </View>
  );
}

/** Renders the scrollable bottom sheet example. */
function BottomSheetScrollableStory(
  bottomSheetProps: ComponentProps<typeof BottomSheetModal>,
) {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  /** Opens the scrollable sheet from the story canvas. */
  function handleOpenPress() {
    bottomSheetRef.current?.present();
  }

  return (
    <View className="flex-1 items-start">
      <Button onPress={handleOpenPress}>
        <Text>Open scrollable sheet</Text>
      </Button>
      <BottomSheetModal {...bottomSheetProps} ref={bottomSheetRef}>
        <Text variant="h3">Settings</Text>
        {scrollItems.map((item) => (
          <View className="border-border gap-1 border-b pb-4" key={item}>
            <Text weight="semibold">{item}</Text>
            <Text variant="muted">
              Example content demonstrating a scrollable bottom sheet row.
            </Text>
          </View>
        ))}
      </BottomSheetModal>
    </View>
  );
}
