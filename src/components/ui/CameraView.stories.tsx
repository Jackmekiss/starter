import { View } from "react-native";

import { CameraView } from "@/components/ui/CameraView";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps } from "react";

const meta = {
  title: "UI/CameraView",
  component: CameraView,
  args: {
    active: false,
    accessibilityLabel: "Inactive camera preview",
  },
  render: InactiveCameraStory,
} satisfies Meta<typeof CameraView>;

export default meta;

/** Story type inferred from CameraView metadata. */
type Story = StoryObj<typeof meta>;

/** Permission-safe preview that never activates camera hardware. */
export const Inactive: Story = {};

/** Documents the camera surface without requesting runtime permission. */
function InactiveCameraStory(props: ComponentProps<typeof CameraView>) {
  return (
    <View className="bg-muted h-64 overflow-hidden rounded-2xl">
      <CameraView {...props} className="absolute inset-0" />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-center" variant="muted">
          Camera hardware stays inactive in Storybook. Permission belongs to the
          feature screen.
        </Text>
      </View>
    </View>
  );
}
