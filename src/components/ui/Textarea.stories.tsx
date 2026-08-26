import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";

import type { Meta, StoryObj } from "@storybook/react-native";

const sizes = ["sm", "md", "lg", "xl"] as const;

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: {
    accessibilityLabel: "Message",
    editable: true,
    invalid: false,
    placeholder: "Write a message",
    size: "md",
  },
  argTypes: {
    size: { control: "select", options: sizes },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

/** Story type inferred from the textarea metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable multiline input. */
export const Playground: Story = {};

/** Representative multiline field states. */
export const States: Story = {
  render: TextareaStatesStory,
};

/** Complete textarea size scale. */
export const Sizes: Story = {
  render: TextareaSizesStory,
};

/** Renders empty, filled, invalid, and disabled textareas. */
function TextareaStatesStory() {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text variant="small">Empty</Text>
        <Textarea accessibilityLabel="Empty message" placeholder="Message" />
      </View>
      <View className="gap-2">
        <Text variant="small">Filled</Text>
        <Textarea
          accessibilityLabel="Filled message"
          defaultValue="A multiline message demonstrates wrapping and spacing."
        />
      </View>
      <View className="gap-2">
        <Text variant="small">Invalid</Text>
        <Textarea
          accessibilityLabel="Invalid message"
          defaultValue="Too short"
          invalid
        />
      </View>
      <View className="gap-2">
        <Text variant="small">Disabled</Text>
        <Textarea
          accessibilityLabel="Disabled message"
          defaultValue="This field cannot be edited."
          editable={false}
        />
      </View>
    </View>
  );
}

/** Renders every supported textarea size. */
function TextareaSizesStory() {
  return (
    <ScrollView className="flex-1">
      <View className="gap-5">
        {sizes.map((size) => (
          <View className="gap-2" key={size}>
            <Text variant="small">{size}</Text>
            <Textarea
              accessibilityLabel={`${size} message`}
              defaultValue="A multiline message demonstrates the type scale."
              size={size}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
