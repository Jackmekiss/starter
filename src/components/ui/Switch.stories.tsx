import { View } from "react-native";
// Storybook stories are development-only by definition.
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { useArgs } from "storybook/preview-api";

import { Switch, switchSizes, type SwitchProps } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";

/** Args exposed to Storybook for the switch playground. */
interface SwitchStoryArgs extends SwitchProps {
  /** Visible and accessible switch label. */
  label: string;
}

/** Row props derive the programmatic name from visible copy. */
type SwitchRowProps = Omit<SwitchStoryArgs, "accessibilityLabel">;

/** Intentionally leaves static state stories unchanged. */
function handleStaticCheckedChange(_checked: boolean) {}

const meta = {
  title: "UI/Switch",
  component: Switch,
  args: {
    accessibilityLabel: "Notifications",
    checked: true,
    disabled: false,
    invalid: false,
    label: "Notifications",
    onCheckedChange: handleStaticCheckedChange,
    size: "md",
    valueLabel: "On",
  },
  argTypes: {
    size: {
      control: "select",
      options: switchSizes,
    },
  },
  render: SwitchPlayground,
} satisfies Meta<SwitchStoryArgs>;

export default meta;

/** Story type inferred from the switch meta configuration. */
type Story = StoryObj<typeof meta>;

/** Controllable switch playground. */
export const Playground: Story = {};

/** Off, on, invalid, and disabled switch states. */
export const States: Story = {
  render: SwitchStatesStory,
};

/** Every switch size in the design system. */
export const Sizes: Story = {
  render: SwitchSizesStory,
};

/** Renders one switch whose presses remain synchronized with controls. */
function SwitchPlayground({
  checked,
  label,
  onCheckedChange,
  ...props
}: SwitchStoryArgs) {
  const [, updateArgs] = useArgs<SwitchStoryArgs>();

  /** Updates Storybook controls before preserving the caller callback. */
  function handleCheckedChange(nextChecked: boolean) {
    updateArgs({ checked: nextChecked });
    onCheckedChange(nextChecked);
  }

  return (
    <StoryFrame>
      <SwitchRow
        {...props}
        checked={checked}
        label={label}
        onCheckedChange={handleCheckedChange}
      />
    </StoryFrame>
  );
}

/** Renders meaningful switch interaction states together. */
function SwitchStatesStory() {
  return (
    <StoryFrame>
      <SwitchRow
        checked={false}
        label="Désactivé"
        onCheckedChange={handleStaticCheckedChange}
        valueLabel="Désactivé"
      />
      <SwitchRow
        checked
        label="Activé"
        onCheckedChange={handleStaticCheckedChange}
        valueLabel="Activé"
      />
      <SwitchRow
        checked
        invalid
        label="Invalide"
        onCheckedChange={handleStaticCheckedChange}
        valueLabel="Activé"
      />
      <SwitchRow
        checked
        disabled
        label="Indisponible"
        onCheckedChange={handleStaticCheckedChange}
        valueLabel="Activé"
      />
    </StoryFrame>
  );
}

/** Renders all supported switch dimensions. */
function SwitchSizesStory() {
  return (
    <StoryFrame>
      {switchSizes.map((size) => (
        <SwitchRow
          key={size}
          checked
          label={size}
          onCheckedChange={handleStaticCheckedChange}
          size={size}
          valueLabel="Activé"
        />
      ))}
    </StoryFrame>
  );
}

/** Pairs one switch with nonduplicated visible label copy. */
function SwitchRow({ label, ...props }: SwitchRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-6">
      <Text accessible={false} importantForAccessibility="no" variant="small">
        {label}
      </Text>
      <Switch {...props} accessibilityLabel={label} />
    </View>
  );
}

/** Provides consistent themed spacing for switch stories. */
function StoryFrame({ children }: { children: ReactNode }) {
  return <View className="bg-background gap-4 p-6">{children}</View>;
}
