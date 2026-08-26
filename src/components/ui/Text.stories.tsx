import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";

const variants = [
  "default",
  "body",
  "heading",
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "blockquote",
  "code",
  "lead",
  "large",
  "small",
  "muted",
] as const;
const sizes = [
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
] as const;
const weights = [
  "thin",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
] as const;
const treatments = [
  "underline",
  "strike",
  "italic",
  "highlight",
  "truncate",
  "subscript",
] as const;

const meta = {
  title: "UI/Text",
  component: Text,
  args: {
    children: "Starter typography",
    size: "md",
    variant: "body",
    weight: "normal",
  },
  argTypes: {
    size: { control: "select", options: sizes },
    treatment: { control: "select", options: treatments },
    variant: { control: "select", options: variants },
    weight: { control: "select", options: weights },
  },
} satisfies Meta<typeof Text>;

export default meta;

/** Story type inferred from the text metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable text example. */
export const Playground: Story = {};

/** Semantic typography hierarchy and compatibility styles. */
export const Variants: Story = {
  render: TextVariantsStory,
};

/** Complete type-size scale. */
export const Sizes: Story = {
  render: TextSizesStory,
};

/** Heading scale, intentionally one step above body copy. */
export const HeadingSizes: Story = {
  render: TextHeadingSizesStory,
};

/** Complete font-weight scale. */
export const Weights: Story = {
  render: TextWeightsStory,
};

/** Inline text treatments supported by the primitive. */
export const Treatments: Story = {
  render: TextTreatmentsStory,
};

/** Renders each semantic typography variant. */
function TextVariantsStory() {
  return (
    <ScrollView className="flex-1">
      <View className="gap-6">
        {variants.map((variant) => (
          <View className="gap-1" key={variant}>
            <Text variant="small">{variant}</Text>
            <Text variant={variant}>
              The quick brown fox jumps over the lazy dog.
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/** Renders every supported typography size. */
function TextSizesStory() {
  return (
    <ScrollView className="flex-1">
      <View className="gap-3">
        {sizes.map((size) => (
          <Text key={size} size={size}>
            {size} — Starter
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

/** Renders every requested size through the heading scale mapping. */
function TextHeadingSizesStory() {
  return (
    <ScrollView className="flex-1">
      <View className="gap-3">
        {sizes.map((size) => (
          <Text key={size} size={size} variant="heading">
            {size} — Starter heading
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

/** Renders every supported typography weight. */
function TextWeightsStory() {
  return (
    <View className="gap-3">
      {weights.map((weight) => (
        <Text key={weight} weight={weight}>
          {weight} — Starter typography
        </Text>
      ))}
    </View>
  );
}

/** Renders every supported inline treatment. */
function TextTreatmentsStory() {
  return (
    <View className="max-w-64 gap-3">
      {treatments.map((treatment) => (
        <Text
          key={treatment}
          numberOfLines={treatment === "truncate" ? 1 : undefined}
          treatment={treatment}
        >
          {treatment} — Starter typography treatment
        </Text>
      ))}
    </View>
  );
}
