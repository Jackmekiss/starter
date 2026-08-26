import { Mail, X } from "lucide-react-native";
import { View } from "react-native";

import { Input, InputGroup, InputIcon, InputSlot } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";

const sizes = ["sm", "md", "lg", "xl"] as const;
const variants = ["rounded", "outline", "underlined"] as const;

/** Handles the decorative clear action in the static story. */
function handleClearPress() {}

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    accessibilityLabel: "Email address",
    editable: true,
    invalid: false,
    placeholder: "name@example.com",
    size: "md",
    variant: "rounded",
  },
  argTypes: {
    size: { control: "select", options: sizes },
    variant: { control: "select", options: variants },
  },
} satisfies Meta<typeof Input>;

export default meta;

/** Story type inferred from the input metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable single-line input. */
export const Playground: Story = {};

/** Rounded, outline, and underlined surfaces. */
export const Variants: Story = {
  render: InputVariantsStory,
};

/** Complete input size scale. */
export const Sizes: Story = {
  render: InputSizesStory,
};

/** Representative field states. */
export const States: Story = {
  render: InputStatesStory,
};

/** Compound input with leading and trailing slots. */
export const WithSlots: Story = {
  render: InputWithSlotsStory,
};

/** Renders each input surface treatment. */
function InputVariantsStory() {
  return (
    <View className="gap-5">
      {variants.map((variant) => (
        <View className="gap-2" key={variant}>
          <Text variant="small">{variant}</Text>
          <Input
            accessibilityLabel={`${variant} email address`}
            placeholder="name@example.com"
            variant={variant}
          />
        </View>
      ))}
    </View>
  );
}

/** Renders each input size. */
function InputSizesStory() {
  return (
    <View className="gap-5">
      {sizes.map((size) => (
        <View className="gap-2" key={size}>
          <Text variant="small">{size}</Text>
          <Input
            accessibilityLabel={`${size} email address`}
            placeholder="name@example.com"
            size={size}
            variant="outline"
          />
        </View>
      ))}
    </View>
  );
}

/** Renders the empty, filled, invalid, and disabled states. */
function InputStatesStory() {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text variant="small">Empty</Text>
        <Input
          accessibilityLabel="Empty email address"
          placeholder="name@example.com"
        />
      </View>
      <View className="gap-2">
        <Text variant="small">Filled</Text>
        <Input
          accessibilityLabel="Filled email address"
          defaultValue="hello@starter.app"
        />
      </View>
      <View className="gap-2">
        <Text variant="small">Invalid</Text>
        <Input
          accessibilityLabel="Invalid email address"
          defaultValue="invalid"
          invalid
        />
      </View>
      <View className="gap-2">
        <Text variant="small">Disabled</Text>
        <Input
          accessibilityLabel="Disabled email address"
          defaultValue="disabled@starter.app"
          editable={false}
        />
      </View>
    </View>
  );
}

/** Renders one compound input with icon and clear affordances. */
function InputWithSlotsStory() {
  return (
    <InputGroup variant="outline">
      <InputIcon accessible={false} as={Mail} />
      <Input accessibilityLabel="Email address with actions" />
      <InputSlot
        accessibilityLabel="Clear email address"
        accessibilityRole="button"
        onPress={handleClearPress}
      >
        <InputIcon accessible={false} as={X} />
      </InputSlot>
    </InputGroup>
  );
}
