import { View } from "react-native";

import {
  Progress,
  progressSizes,
  type ProgressProps,
} from "@/components/ui/Progress";

import type { Meta, StoryObj } from "@storybook/react-native";

const meta = {
  title: "UI/Progress",
  component: Progress,
  args: {
    accessibilityLabel: "Progression",
    label: "4/8",
    max: 100,
    size: "md",
    value: 50,
  },
  argTypes: {
    size: {
      control: "select",
      options: progressSizes,
    },
    value: {
      control: { max: 100, min: 0, step: 1, type: "range" },
    },
  },
  render: ProgressPlayground,
} satisfies Meta<ProgressProps>;

export default meta;

/** Story type inferred from the progress meta configuration. */
type Story = StoryObj<typeof meta>;

/** Controllable determinate progress playground. */
export const Playground: Story = {};

/** Every track thickness from Fifteen's design system. */
export const Sizes: Story = {
  render: ProgressSizesStory,
};

/** Empty, partial, and complete determinate progress states. */
export const States: Story = {
  render: ProgressStatesStory,
};

/** Renders one progress indicator from Storybook controls. */
function ProgressPlayground(props: ProgressProps) {
  return (
    <StoryFrame>
      <Progress {...props} />
    </StoryFrame>
  );
}

/** Renders all supported progress thicknesses. */
function ProgressSizesStory() {
  return (
    <StoryFrame>
      {progressSizes.map((size) => (
        <Progress
          key={size}
          accessibilityLabel={`Progression ${size}`}
          label={`4/8 · ${size}`}
          size={size}
          value={50}
        />
      ))}
    </StoryFrame>
  );
}

/** Renders determinate progress at its meaningful boundaries. */
function ProgressStatesStory() {
  return (
    <StoryFrame>
      <Progress accessibilityLabel="Progression vide" label="0/8" value={0} />
      <Progress
        accessibilityLabel="Progression partielle"
        label="3/8"
        value={37.5}
      />
      <Progress
        accessibilityLabel="Progression terminée"
        label="8/8"
        value={100}
      />
    </StoryFrame>
  );
}

/** Provides a full-width themed frame for progress stories. */
function StoryFrame({ children }: { children: React.ReactNode }) {
  return <View className="bg-background w-full gap-8 p-6">{children}</View>;
}
