import { CircleCheck, Heart, TriangleAlert } from "lucide-react-native";
import { View } from "react-native";

import { Icon } from "@/components/ui/Icon";

import type { Meta, StoryObj } from "@storybook/react-native";

const meta = {
  title: "UI/Icon",
  component: Icon,
  args: {
    accessible: false,
    as: CircleCheck,
    size: 24,
  },
} satisfies Meta<typeof Icon>;

export default meta;

/** Story type inferred from the icon metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable Lucide icon wrapper. */
export const Playground: Story = {};

/** Representative semantic icon treatments. */
export const Examples: Story = {
  render: IconExamplesStory,
};

/** Renders neutral, destructive, and primary icon examples. */
function IconExamplesStory() {
  return (
    <View className="flex-row items-center gap-6">
      <Icon accessible={false} as={Heart} className="text-primary" size={28} />
      <Icon
        accessible={false}
        as={TriangleAlert}
        className="text-destructive"
        size={28}
      />
      <Icon accessible={false} as={CircleCheck} size={28} />
    </View>
  );
}
