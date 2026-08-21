import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import {
  DesignSystemToast,
  Toast,
  ToastCloseButton,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastText,
  ToastTitle,
  useToast,
} from "@/components/ui/Toast";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps, ReactNode } from "react";

/** Args exposed by the Toast story playground. */
interface ToastStoryArgs extends Omit<
  ComponentProps<typeof Toast>,
  "children"
> {
  /** Supporting copy displayed by the Toast. */
  description: string;
  /** Whether the close action is displayed. */
  showClose: boolean;
  /** Whether the semantic icon is displayed. */
  showIcon: boolean;
  /** Optional title displayed above the supporting copy. */
  title: string;
}

const toastActions = ["error", "info", "muted", "success", "warning"] as const;
const toastVariants = ["outline", "solid"] as const;

/** Handles actions in static Storybook examples. */
function handleAction() {}

/** Handles close actions in static Storybook examples. */
function handleClose() {}

const meta = {
  title: "UI/Toast",
  component: Toast,
  args: {
    action: "error",
    description: "The requested change could not be completed.",
    showClose: true,
    showIcon: true,
    title: "Something went wrong",
    variant: "outline",
  },
  argTypes: {
    action: { control: "select", options: toastActions },
    variant: { control: "select", options: toastVariants },
  },
  render: ToastPlayground,
} satisfies Meta<ToastStoryArgs>;

export default meta;

/** Story type inferred from the Toast metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable static Toast surface. */
export const Playground: Story = {};

/** Every semantic action in both surface treatments. */
export const Variants: Story = {
  render: ToastVariantsStory,
};

/** Interactive trigger using the public Toast API and mounted Storybook host. */
export const Trigger: Story = {
  render: ToastTriggerStory,
};

/** Renders one controllable static Toast. */
function ToastPlayground({
  description,
  showClose,
  showIcon,
  title,
  ...props
}: ToastStoryArgs) {
  return (
    <StoryFrame>
      <Toast {...props}>
        <ToastContent>
          {showIcon ? <ToastIcon /> : null}
          <ToastText>
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </ToastText>
          {showClose ? (
            <ToastCloseButton
              accessibilityLabel="Close notification"
              onPress={handleClose}
            />
          ) : null}
        </ToastContent>
      </Toast>
    </StoryFrame>
  );
}

/** Renders all Toast actions and surfaces with fixed anatomy. */
function ToastVariantsStory() {
  return (
    <StoryFrame>
      {toastVariants.map((variant) => (
        <View className="gap-4" key={variant}>
          <Text className="capitalize" variant="large">
            {variant}
          </Text>
          {toastActions.map((action) => (
            <DesignSystemToast
              action={action}
              actionAccessibilityLabel="Retry request"
              actionLabel="Retry"
              closeAccessibilityLabel="Close notification"
              description="Semantic feedback remains readable in every theme."
              key={action}
              onActionPress={handleAction}
              onClose={handleClose}
              showClose
              title={action}
              variant={variant}
            />
          ))}
        </View>
      ))}
    </StoryFrame>
  );
}

/** Renders a Button that calls the restricted Toast API. */
function ToastTriggerStory() {
  const toast = useToast();

  /** Displays a sample error Toast. */
  function handleShowToast() {
    toast.show({
      action: "error",
      actionAccessibilityLabel: "Retry request",
      actionLabel: "Retry",
      closeAccessibilityLabel: "Close notification",
      description: "The requested change could not be completed.",
      onActionPress: handleAction,
      title: "Something went wrong",
      variant: "solid",
    });
  }

  return (
    <StoryFrame>
      <Button onPress={handleShowToast}>
        <Text>Show Toast</Text>
      </Button>
    </StoryFrame>
  );
}

/** Props accepted by the common Toast story frame. */
interface StoryFrameProps {
  /** Story content. */
  children: ReactNode;
}

/** Provides full-width themed spacing for Toast stories. */
function StoryFrame({ children }: StoryFrameProps) {
  return (
    <ScrollView className="bg-background flex-1">
      <View className="items-center gap-8 p-6">{children}</View>
    </ScrollView>
  );
}
