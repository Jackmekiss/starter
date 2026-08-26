import { Check } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps, ReactNode } from "react";

/** Args exposed by the button playground. */
interface ButtonStoryArgs extends ComponentProps<typeof Button> {
  /** Text rendered inside the button. */
  label: string;
  /** Whether the story renders the busy indicator. */
  loading: boolean;
}

/** Props accepted by one labeled story section. */
interface StorySectionProps {
  /** Section content. */
  children: ReactNode;
  /** Section heading. */
  title: string;
}

const actions = ["primary", "tertiary", "negative"] as const;
const designSystemVariants = ["solid", "outline", "link"] as const;
const sizes = ["xs", "sm", "md", "lg", "xl", "icon"] as const;
const playgroundVariants = [
  "default",
  "solid",
  "outline",
  "link",
  "destructive",
  "secondary",
  "ghost",
] as const;

/** Handles presses in static Storybook examples. */
function handlePress() {}

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    action: "primary",
    disabled: false,
    label: "Continue",
    loading: false,
    onPress: handlePress,
    size: "md",
    variant: "solid",
  },
  argTypes: {
    action: { control: "select", options: actions },
    size: { control: "select", options: sizes },
    variant: { control: "select", options: playgroundVariants },
  },
  render: ButtonPlayground,
} satisfies Meta<ButtonStoryArgs>;

export default meta;

/** Story type inferred from the button metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable button example. */
export const Playground: Story = {};

/** Canonical action and surface combinations. */
export const Variants: Story = {
  render: ButtonVariantsStory,
};

/** Complete button size scale. */
export const Sizes: Story = {
  render: ButtonSizesStory,
};

/** Common enabled, icon, disabled, and busy states. */
export const States: Story = {
  render: ButtonStatesStory,
};

/** Interactive entrance and exit of the shared button spinner. */
export const LoaderTransition: Story = {
  render: ButtonLoaderTransitionStory,
};

/** Renders the controllable button story. */
function ButtonPlayground({ label, loading, ...buttonProps }: ButtonStoryArgs) {
  const disabled = buttonProps.disabled || loading;

  return (
    <View className="items-start">
      <Button
        {...buttonProps}
        accessibilityState={{
          ...buttonProps.accessibilityState,
          busy: loading,
          disabled,
        }}
        disabled={disabled}
      >
        {loading ? <ButtonSpinner /> : null}
        <ButtonText>{label}</ButtonText>
      </Button>
    </View>
  );
}

/** Renders every action and visual variant. */
function ButtonVariantsStory() {
  return (
    <ScrollView className="flex-1">
      <View className="gap-6">
        {actions.map((action) => (
          <StorySection key={action} title={action}>
            <ButtonGroup orientation="vertical" className="items-start">
              {designSystemVariants.map((variant) => (
                <Button
                  action={action}
                  key={variant}
                  onPress={handlePress}
                  variant={variant}
                >
                  <ButtonText>{variant}</ButtonText>
                </Button>
              ))}
            </ButtonGroup>
          </StorySection>
        ))}
      </View>
    </ScrollView>
  );
}

/** Renders every button size, including the icon-only target. */
function ButtonSizesStory() {
  return (
    <ButtonGroup orientation="vertical" className="items-start">
      {sizes.map((size) => (
        <Button
          accessibilityLabel={size === "icon" ? "Confirm" : undefined}
          key={size}
          onPress={handlePress}
          size={size}
        >
          {size === "icon" ? (
            <ButtonIcon accessible={false} as={Check} />
          ) : (
            <ButtonText>{size}</ButtonText>
          )}
        </Button>
      ))}
    </ButtonGroup>
  );
}

/** Renders representative button interaction states. */
function ButtonStatesStory() {
  return (
    <ButtonGroup orientation="vertical" className="items-start">
      <Button onPress={handlePress}>
        <ButtonIcon accessible={false} as={Check} />
        <ButtonText>With icon</ButtonText>
      </Button>
      <Button disabled onPress={handlePress}>
        <ButtonText>Disabled</ButtonText>
      </Button>
      <Button
        accessibilityState={{ busy: true, disabled: true }}
        disabled
        onPress={handlePress}
      >
        <ButtonSpinner />
        <ButtonText>Loading</ButtonText>
      </Button>
      <Button
        accessibilityLabel="Loading"
        accessibilityState={{ busy: true, disabled: true }}
        disabled
        onPress={handlePress}
        size="icon"
      >
        <ButtonSpinner />
      </Button>
    </ButtonGroup>
  );
}

/** Demonstrates both spinner directions without changing button dimensions. */
function ButtonLoaderTransitionStory() {
  const [loading, setLoading] = useState(false);

  return (
    <ButtonGroup orientation="vertical" className="items-start">
      <Button
        accessibilityState={{ busy: loading, disabled: loading }}
        className="w-56"
        disabled={loading}
        onPress={handlePress}
      >
        {loading ? <ButtonSpinner /> : null}
        <ButtonText>Save changes</ButtonText>
      </Button>
      <Button
        onPress={() => setLoading((currentLoading) => !currentLoading)}
        variant="outline"
      >
        <ButtonText>{loading ? "Hide loader" : "Show loader"}</ButtonText>
      </Button>
    </ButtonGroup>
  );
}

/** Labels one group of related button examples. */
function StorySection({ children, title }: StorySectionProps) {
  return (
    <View className="gap-3">
      <Text className="capitalize" variant="small">
        {title}
      </Text>
      {children}
    </View>
  );
}
