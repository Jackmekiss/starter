import { useRef } from "react";
import { View } from "react-native";

import {
  BottomSheet,
  type BottomSheetModalRef,
} from "@/components/ui/BottomSheetModal";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";

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
  title: "UI/BottomSheet",
  component: BottomSheet,
  args: {
    children: null,
    contentAccessibilityLabel: "Persistent bottom sheet content",
    snapPoints: ["40%"],
    variant: "persistent",
  },
  render: PersistentBottomSheetStory,
} satisfies Meta<typeof BottomSheet>;

export default meta;

/** Story type inferred from the unified bottom sheet metadata. */
type Story = StoryObj<typeof meta>;

/** Always-visible sheet without dismissal gestures or a handle. */
export const Persistent: Story = {};

/** Closable sheet that leaves the background interactive. */
export const NonModal: Story = {
  render: NonModalBottomSheetStory,
};

/** Blocking modal sheet with an accessible dismissing backdrop. */
export const Modal: Story = {
  render: ModalBottomSheetStory,
};

/** Scrollable content inside a non-modal sheet. */
export const Scrollable: Story = {
  render: ScrollableBottomSheetStory,
};

/** Renders the in-tree persistent behavior. */
function PersistentBottomSheetStory() {
  return (
    <View className="flex-1 gap-6">
      <Text variant="muted">
        The controls behind this sheet remain interactive.
      </Text>
      <BottomSheet
        contentAccessibilityLabel="Persistent bottom sheet content"
        enableDynamicSizing={false}
        index={0}
        snapPoints={["40%"]}
        variant="persistent"
      >
        <View className="gap-2">
          <Text variant="h3">Persistent</Text>
          <Text>This sheet cannot be dragged, lowered, or dismissed.</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

/** Renders the closable non-modal behavior. */
function NonModalBottomSheetStory() {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  /** Opens the non-modal sheet from the story canvas. */
  function handleOpenPress() {
    bottomSheetRef.current?.present();
  }

  return (
    <View className="flex-1 items-start gap-6">
      <Button onPress={handleOpenPress}>
        <Text>Open non-modal sheet</Text>
      </Button>
      <BottomSheet
        ref={bottomSheetRef}
        contentAccessibilityLabel="Non-modal bottom sheet content"
        handleAccessibilityHint="Swipe to resize or dismiss the bottom sheet"
        handleAccessibilityLabel="Bottom sheet handle"
        snapPoints={["40%"]}
        variant="nonModal"
      >
        <View className="gap-2">
          <Text variant="h3">Non-modal</Text>
          <Text>
            The background remains interactive while this sheet is open.
          </Text>
        </View>
      </BottomSheet>
    </View>
  );
}

/** Renders the blocking modal behavior. */
function ModalBottomSheetStory() {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  /** Opens the modal sheet from the story canvas. */
  function handleOpenPress() {
    bottomSheetRef.current?.present();
  }

  return (
    <View className="flex-1 items-start gap-6">
      <Button onPress={handleOpenPress}>
        <Text>Open modal sheet</Text>
      </Button>
      <BottomSheet
        ref={bottomSheetRef}
        backdropAccessibilityHint="Closes the bottom sheet"
        backdropAccessibilityLabel="Close bottom sheet"
        contentAccessibilityLabel="Modal bottom sheet content"
        snapPoints={["40%"]}
        variant="modal"
      >
        <View className="gap-2">
          <Text variant="h3">Modal</Text>
          <Text>The backdrop blocks interaction with the background.</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

/** Renders longer content through the shared scroll container. */
function ScrollableBottomSheetStory() {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  /** Opens the scrollable sheet from the story canvas. */
  function handleOpenPress() {
    bottomSheetRef.current?.present();
  }

  return (
    <View className="flex-1 items-start gap-6">
      <Button onPress={handleOpenPress}>
        <Text>Open scrollable sheet</Text>
      </Button>
      <BottomSheet
        ref={bottomSheetRef}
        contentAccessibilityLabel="Scrollable bottom sheet content"
        handleAccessibilityHint="Swipe to resize or dismiss the bottom sheet"
        handleAccessibilityLabel="Bottom sheet handle"
        scrollable
        snapPoints={["65%"]}
        variant="nonModal"
      >
        <Text variant="h3">Settings</Text>
        {scrollItems.map((item) => (
          <View className="border-border gap-1 border-b pb-4" key={item}>
            <Text weight="semibold">{item}</Text>
            <Text variant="muted">
              Example content demonstrating a scrollable bottom sheet row.
            </Text>
          </View>
        ))}
      </BottomSheet>
    </View>
  );
}
