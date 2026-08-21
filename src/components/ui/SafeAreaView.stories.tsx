import { SafeAreaView } from "@/components/ui/SafeAreaView";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";

const meta = {
  title: "UI/SafeAreaView",
  component: SafeAreaView,
} satisfies Meta<typeof SafeAreaView>;

export default meta;

/** Story type inferred from SafeAreaView metadata. */
type Story = StoryObj<typeof meta>;

/** Container respecting top and bottom device insets. */
export const Default: Story = {
  render: SafeAreaStory,
};

/** Renders a visible safe-area surface. */
function SafeAreaStory() {
  return (
    <SafeAreaView
      className="bg-primary-soft flex-1 items-center justify-center rounded-2xl p-6"
      edges={["top", "bottom"]}
    >
      <Text className="text-primary-emphasis">Safe content</Text>
    </SafeAreaView>
  );
}
