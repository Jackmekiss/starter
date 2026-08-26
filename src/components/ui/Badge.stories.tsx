import { Bike, Globe } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Badge, BadgeIcon, BadgeText } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps, ReactNode } from "react";

/** Args exposed by the Badge story playground. */
interface BadgeStoryArgs extends Omit<
  ComponentProps<typeof Badge>,
  "children"
> {
  /** Text rendered directly by the Badge. */
  label: string;
}

const badgeActions = [
  "error",
  "warning",
  "success",
  "info",
  "muted",
  "primary",
] as const;
const badgeSizes = ["sm", "md", "lg"] as const;
const badgeVariants = ["solid", "outline"] as const;

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: {
    action: "primary",
    label: "NEW FEATURE",
    size: "sm",
    variant: "solid",
  },
  argTypes: {
    action: { control: "select", options: badgeActions },
    size: { control: "select", options: badgeSizes },
    variant: { control: "select", options: badgeVariants },
  },
  render: BadgePlayground,
} satisfies Meta<BadgeStoryArgs>;

export default meta;

/** Story type inferred from the Badge metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable direct-text Badge example. */
export const Playground: Story = {};

/** Every semantic action in both surface treatments. */
export const Variants: Story = {
  render: BadgeVariantsStory,
};

/** All Badge sizes with their corresponding typography and icon scales. */
export const Sizes: Story = {
  render: BadgeSizesStory,
};

/** Compound anatomy with leading and trailing icons. */
export const Anatomy: Story = {
  render: BadgeAnatomyStory,
};

/** Renders one controllable direct-text Badge. */
function BadgePlayground({ label, ...props }: BadgeStoryArgs) {
  return (
    <StoryFrame>
      <Badge {...props}>{label}</Badge>
    </StoryFrame>
  );
}

/** Renders all Badge action and surface combinations. */
function BadgeVariantsStory() {
  return (
    <StoryFrame>
      {badgeVariants.map((variant) => (
        <View className="items-start gap-3" key={variant}>
          <Text className="capitalize" variant="large">
            {variant}
          </Text>
          {badgeActions.map((action) => (
            <Badge action={action} key={action} variant={variant}>
              {action.toUpperCase()}
            </Badge>
          ))}
        </View>
      ))}
    </StoryFrame>
  );
}

/** Renders the three canonical Badge sizes. */
function BadgeSizesStory() {
  return (
    <StoryFrame>
      <View className="items-start gap-3">
        {badgeSizes.map((size) => (
          <Badge action="success" key={size} size={size}>
            <BadgeIcon as={Bike} />
            <BadgeText>{size.toUpperCase()} BADGE</BadgeText>
          </Badge>
        ))}
      </View>
    </StoryFrame>
  );
}

/** Renders direct text and explicit compound Badge anatomy. */
function BadgeAnatomyStory() {
  return (
    <StoryFrame>
      <View className="items-start gap-3">
        <Badge action="info">DIRECT TEXT</Badge>
        <Badge action="info" size="md">
          <BadgeIcon as={Bike} />
          <BadgeText>COMPOUND CONTENT</BadgeText>
          <BadgeIcon as={Globe} placement="right" />
        </Badge>
      </View>
    </StoryFrame>
  );
}

/** Props accepted by the common Badge story frame. */
interface StoryFrameProps {
  /** Story content. */
  children: ReactNode;
}

/** Provides themed spacing for Badge stories. */
function StoryFrame({ children }: StoryFrameProps) {
  return (
    <ScrollView className="bg-background flex-1">
      <View className="gap-8 p-6">{children}</View>
    </ScrollView>
  );
}
