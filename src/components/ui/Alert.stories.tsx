import { ScrollView, View } from "react-native";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertLink,
  AlertTitle,
} from "@/components/ui/Alert";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps, ReactNode } from "react";

/** Args exposed by the Alert story playground. */
interface AlertStoryArgs extends Omit<
  ComponentProps<typeof Alert>,
  "children"
> {
  /** Supporting copy displayed in the Alert. */
  description: string;
  /** Optional title displayed above the supporting copy. */
  title: string;
  /** Whether the semantic icon is displayed. */
  withIcon: boolean;
  /** Whether the title is displayed. */
  withTitle: boolean;
}

const alertActions = ["muted", "success", "info", "error", "warning"] as const;
const alertVariants = ["outline", "solid"] as const;

/** Handles link presses in static Storybook examples. */
function handleLinkPress() {}

const meta = {
  title: "UI/Alert",
  component: Alert,
  args: {
    action: "info",
    description:
      "Delivery generated less carbon dioxide than standard home delivery.",
    title: "Delivery impact",
    variant: "outline",
    withIcon: true,
    withTitle: true,
  },
  argTypes: {
    action: { control: "select", options: alertActions },
    variant: { control: "select", options: alertVariants },
  },
  render: AlertPlayground,
} satisfies Meta<AlertStoryArgs>;

export default meta;

/** Story type inferred from the Alert metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable Alert example. */
export const Playground: Story = {};

/** Every semantic action in both surface treatments. */
export const Variants: Story = {
  render: AlertVariantsStory,
};

/** Title and description anatomy with the canonical density rules. */
export const Anatomy: Story = {
  render: AlertAnatomyStory,
};

/** Renders one controllable Alert. */
function AlertPlayground({
  description,
  title,
  withIcon,
  withTitle,
  ...props
}: AlertStoryArgs) {
  return (
    <StoryFrame>
      <Alert {...props} type={withTitle ? "with-heading" : "without-heading"}>
        {withIcon ? <AlertIcon /> : null}
        <AlertContent>
          {withTitle ? <AlertTitle>{title}</AlertTitle> : null}
          <AlertDescription>{description}</AlertDescription>
          <AlertLink onPress={handleLinkPress}>View details</AlertLink>
        </AlertContent>
      </Alert>
    </StoryFrame>
  );
}

/** Renders the full Alert action and surface matrix. */
function AlertVariantsStory() {
  return (
    <StoryFrame>
      {alertVariants.map((variant) => (
        <View className="gap-4" key={variant}>
          <Text className="capitalize" variant="large">
            {variant}
          </Text>
          {alertActions.map((action) => (
            <Alert
              action={action}
              key={action}
              type="with-heading"
              variant={variant}
            >
              <AlertIcon />
              <AlertContent>
                <AlertTitle className="capitalize">{action}</AlertTitle>
                <AlertDescription>
                  Semantic feedback remains readable in every theme.
                </AlertDescription>
              </AlertContent>
            </Alert>
          ))}
        </View>
      ))}
    </StoryFrame>
  );
}

/** Renders Alert anatomy with and without a title. */
function AlertAnatomyStory() {
  return (
    <StoryFrame>
      <Alert action="success" type="with-heading" variant="solid">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Payment received</AlertTitle>
          <AlertDescription>Your receipt is now available.</AlertDescription>
          <AlertLink onPress={handleLinkPress}>Open receipt</AlertLink>
        </AlertContent>
      </Alert>
      <Alert action="warning" type="without-heading">
        <AlertIcon />
        <AlertContent>
          <AlertDescription>
            Verify the address before confirming delivery.
          </AlertDescription>
        </AlertContent>
      </Alert>
    </StoryFrame>
  );
}

/** Props accepted by the common Alert story frame. */
interface StoryFrameProps {
  /** Story content. */
  children: ReactNode;
}

/** Provides full-width themed spacing for Alert stories. */
function StoryFrame({ children }: StoryFrameProps) {
  return (
    <ScrollView className="bg-background flex-1">
      <View className="w-full gap-8 p-6">{children}</View>
    </ScrollView>
  );
}
