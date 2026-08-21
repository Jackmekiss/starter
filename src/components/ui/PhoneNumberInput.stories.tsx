import * as React from "react";
import { View } from "react-native";

import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps } from "react";

/** Args exposed by the controlled phone input story. */
interface PhoneNumberInputStoryArgs extends ComponentProps<
  typeof PhoneNumberInput
> {}

/** Handles the inert default Storybook callback. */
function handleValueChange() {}

const meta = {
  title: "UI/PhoneNumberInput",
  component: PhoneNumberInput,
  args: {
    accessibilityLabel: "Phone number",
    countryButtonAccessibilityLabel: "Choose a country",
    disabled: false,
    language: "eng",
    onValueChange: handleValueChange,
    value: "+33612345678",
  },
  render: PhoneNumberInputPlayground,
} satisfies Meta<PhoneNumberInputStoryArgs>;

export default meta;

/** Story type inferred from PhoneNumberInput metadata. */
type Story = StoryObj<typeof meta>;

/** Controlled phone number playground. */
export const Playground: Story = {};

/** Disabled phone number state. */
export const Disabled: Story = {
  args: { disabled: true },
};

/** Invalid phone number state. */
export const Invalid: Story = {
  args: { invalid: true },
};

/** Keeps the story controlled while displaying its international value. */
function PhoneNumberInputPlayground({
  value,
  ...props
}: PhoneNumberInputStoryArgs) {
  const [phoneNumber, setPhoneNumber] = React.useState(value);

  return (
    <View className="gap-3">
      <PhoneNumberInput
        {...props}
        onValueChange={setPhoneNumber}
        value={phoneNumber}
      />
      <Text variant="muted">{phoneNumber}</Text>
    </View>
  );
}
