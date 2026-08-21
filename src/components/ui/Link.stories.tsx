import { View } from "react-native";

import { Link, LinkText } from "@/components/ui/Link";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps } from "react";

/** Args exposed by the Link story playground. */
interface LinkStoryArgs extends Omit<ComponentProps<typeof Link>, "children"> {
  /** Visible direct-text label. */
  label: string;
}

/** Handles presses in static Storybook examples. */
function handlePress() {}

const meta = {
  title: "UI/Link",
  component: Link,
  args: {
    disabled: false,
    label: "View terms and conditions",
    onPress: handlePress,
  },
  render: LinkPlayground,
} satisfies Meta<LinkStoryArgs>;

export default meta;

/** Story type inferred from the Link metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable Link example. */
export const Playground: Story = {};

/** Enabled, disabled, URL, and compound Link states. */
export const States: Story = {
  render: LinkStatesStory,
};

/** Renders one controllable direct-text Link. */
function LinkPlayground({ label, ...props }: LinkStoryArgs) {
  return (
    <StoryFrame>
      <Link {...props}>{label}</Link>
    </StoryFrame>
  );
}

/** Renders the supported action and content forms together. */
function LinkStatesStory() {
  return (
    <StoryFrame>
      <Link onPress={handlePress}>Action link</Link>
      <Link disabled onPress={handlePress}>
        Disabled link
      </Link>
      <Link href="https://example.com">URL link</Link>
      <Link onPress={handlePress}>
        <LinkText>Compound text</LinkText>
      </Link>
    </StoryFrame>
  );
}

/** Provides themed spacing for Link stories. */
function StoryFrame({ children }: { children: React.ReactNode }) {
  return <View className="bg-background gap-4 p-6">{children}</View>;
}
