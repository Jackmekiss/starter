import { ScreenHeader } from "@/components/ui/ScreenHeader";

import type { Meta, StoryObj } from "@storybook/react-native";

/** Handles inert back navigation in the isolated story. */
function handleBack() {}

const meta = {
  title: "UI/ScreenHeader",
  component: ScreenHeader,
  args: {
    backAccessibilityLabel: "Go back",
    onBack: handleBack,
    title: "Account settings",
  },
} satisfies Meta<typeof ScreenHeader>;

export default meta;

/** Story type inferred from ScreenHeader metadata. */
type Story = StoryObj<typeof meta>;

/** Standard centered screen header. */
export const Default: Story = {};

/** Long and scaled titles wrap without moving or obscuring the back action. */
export const LongTitle: Story = {
  args: {
    title: "A deliberately long screen title that cannot fit on one line",
  },
};
