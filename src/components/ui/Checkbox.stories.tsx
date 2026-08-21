import { View } from "react-native";
// Storybook stories are development-only by definition.
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { useArgs } from "storybook/preview-api";

import {
  Checkbox,
  checkboxLabelVariants,
  checkboxSizes,
  type CheckboxProps,
} from "@/components/ui/Checkbox";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";

/** Args exposed to Storybook for the checkbox playground. */
interface CheckboxStoryArgs extends CheckboxProps {
  /** Visible and accessible checkbox label. */
  label: string;
}

/** Row props derive the programmatic name from visible copy. */
type CheckboxRowProps = Omit<CheckboxStoryArgs, "accessibilityLabel">;

/** Intentionally leaves static state stories unchanged. */
function handleStaticCheckedChange(_checked: boolean) {}

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: {
    accessibilityLabel: "J'accepte les conditions",
    checked: false,
    disabled: false,
    invalid: false,
    label: "J'accepte les conditions",
    onCheckedChange: handleStaticCheckedChange,
    size: "md",
  },
  argTypes: {
    checked: {
      control: "select",
      options: [false, true, "indeterminate"],
    },
    size: {
      control: "select",
      options: checkboxSizes,
    },
  },
  render: CheckboxPlayground,
} satisfies Meta<CheckboxStoryArgs>;

export default meta;

/** Story type inferred from the checkbox meta configuration. */
type Story = StoryObj<typeof meta>;

/** Controllable checkbox playground. */
export const Playground: Story = {};

/** Binary, indeterminate, invalid, and disabled checkbox states. */
export const States: Story = {
  render: CheckboxStatesStory,
};

/** Every checkbox size from Fifteen's design system. */
export const Sizes: Story = {
  render: CheckboxSizesStory,
};

/** Renders one checkbox whose presses remain synchronized with controls. */
function CheckboxPlayground({
  checked,
  label,
  onCheckedChange,
  ...props
}: CheckboxStoryArgs) {
  const [, updateArgs] = useArgs<CheckboxStoryArgs>();

  /** Updates Storybook controls before preserving the caller callback. */
  function handleCheckedChange(nextChecked: boolean) {
    updateArgs({ checked: nextChecked });
    onCheckedChange(nextChecked);
  }

  return (
    <StoryFrame>
      <CheckboxRow
        {...props}
        checked={checked}
        label={label}
        onCheckedChange={handleCheckedChange}
      />
    </StoryFrame>
  );
}

/** Renders the supported checkbox interaction states together. */
function CheckboxStatesStory() {
  return (
    <StoryFrame>
      <CheckboxRow
        checked={false}
        label="Non cochée"
        onCheckedChange={handleStaticCheckedChange}
      />
      <CheckboxRow
        checked
        label="Cochée"
        onCheckedChange={handleStaticCheckedChange}
      />
      <CheckboxRow
        checked="indeterminate"
        label="Indéterminée"
        onCheckedChange={handleStaticCheckedChange}
      />
      <CheckboxRow
        checked
        invalid
        label="Invalide"
        onCheckedChange={handleStaticCheckedChange}
      />
      <CheckboxRow
        checked
        disabled
        label="Désactivée"
        onCheckedChange={handleStaticCheckedChange}
      />
    </StoryFrame>
  );
}

/** Renders all supported checkbox dimensions. */
function CheckboxSizesStory() {
  return (
    <StoryFrame>
      {checkboxSizes.map((size) => (
        <CheckboxRow
          key={size}
          checked
          label={size}
          onCheckedChange={handleStaticCheckedChange}
          size={size}
        />
      ))}
    </StoryFrame>
  );
}

/** Pairs one semantic checkbox with nonduplicated visible label copy. */
function CheckboxRow({ label, size = "md", ...props }: CheckboxRowProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Checkbox {...props} accessibilityLabel={label} size={size} />
      <Text
        accessible={false}
        className={checkboxLabelVariants({ size })}
        importantForAccessibility="no"
      >
        {label}
      </Text>
    </View>
  );
}

/** Provides consistent themed spacing for checkbox stories. */
function StoryFrame({ children }: { children: ReactNode }) {
  return <View className="bg-background gap-4 p-6">{children}</View>;
}
