import { View } from "react-native";
// Storybook stories are development-only by definition.
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { useArgs } from "storybook/preview-api";

import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupLabel,
  radioSizes,
  type RadioGroupProps,
  type RadioSize,
} from "@/components/ui/Radio";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";

/** Args exposed to Storybook for the radio-group playground. */
interface RadioStoryArgs extends RadioGroupProps {
  /** Shows the invalid state on the group. */
  invalid: boolean;
}

/** Intentionally leaves static state stories unchanged. */
function handleStaticValueChange(_value: string) {}

const meta = {
  title: "UI/Radio",
  component: RadioGroup,
  args: {
    disabled: false,
    invalid: false,
    onValueChange: handleStaticValueChange,
    size: "md",
    value: "bike",
  },
  argTypes: {
    size: {
      control: "select",
      options: radioSizes,
    },
  },
  render: RadioPlayground,
} satisfies Meta<RadioStoryArgs>;

export default meta;

/** Story type inferred from the radio-group meta configuration. */
type Story = StoryObj<typeof meta>;

/** Controllable radio-group playground. */
export const Playground: Story = {};

/** Radio group with selected and disabled options. */
export const Group: Story = {
  render: RadioGroupStory,
};

/** Every radio size from Fifteen's design system. */
export const Sizes: Story = {
  render: RadioSizesStory,
};

/** Renders an interactive radio group synchronized with controls. */
function RadioPlayground({ onValueChange, value, ...props }: RadioStoryArgs) {
  const [, updateArgs] = useArgs<RadioStoryArgs>();

  /** Updates Storybook controls before preserving the caller callback. */
  function handleValueChange(nextValue: string) {
    updateArgs({ value: nextValue });
    onValueChange(nextValue);
  }

  return (
    <StoryFrame>
      <RadioGroup {...props} onValueChange={handleValueChange} value={value}>
        <RadioOption label="Vélo" value="bike" />
        <RadioOption label="Cargo" value="cargo" />
        <RadioOption disabled label="Indisponible" value="disabled" />
      </RadioGroup>
    </StoryFrame>
  );
}

/** Renders a common option group with one disabled choice. */
function RadioGroupStory() {
  return (
    <StoryFrame>
      <RadioGroup onValueChange={handleStaticValueChange} value="cargo">
        <RadioOption label="Vélo" value="bike" />
        <RadioOption label="Cargo" value="cargo" />
        <RadioOption disabled label="Indisponible" value="disabled" />
      </RadioGroup>
    </StoryFrame>
  );
}

/** Renders all supported radio dimensions. */
function RadioSizesStory() {
  return (
    <StoryFrame>
      {radioSizes.map((size) => (
        <RadioGroup
          key={size}
          onValueChange={handleStaticValueChange}
          size={size}
          value={size}
        >
          <RadioOption label={size} size={size} value={size} />
        </RadioGroup>
      ))}
    </StoryFrame>
  );
}

/** Props accepted by one labelled radio sample. */
interface RadioOptionProps {
  /** Prevents this option from changing. */
  disabled?: boolean;
  /** Visible and accessible option label. */
  label: string;
  /** Optional item-level size override. */
  size?: RadioSize;
  /** Stable value submitted by this option. */
  value: string;
}

/** Renders one radio item with a single semantic press target. */
function RadioOption({ disabled, label, size, value }: RadioOptionProps) {
  return (
    <RadioGroupItem
      accessibilityLabel={label}
      disabled={disabled}
      size={size}
      value={value}
    >
      <RadioGroupLabel accessible={false} importantForAccessibility="no">
        {label}
      </RadioGroupLabel>
    </RadioGroupItem>
  );
}

/** Provides consistent themed spacing for radio stories. */
function StoryFrame({ children }: { children: ReactNode }) {
  return <View className="bg-background gap-4 p-6">{children}</View>;
}
