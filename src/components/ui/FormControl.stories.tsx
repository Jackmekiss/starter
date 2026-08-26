import { View } from "react-native";

import {
  FormControl,
  FormControlDescription,
  FormControlInput,
  FormControlLabel,
  FormControlMessage,
  formControlSizes,
  type FormControlProps,
} from "@/components/ui/FormControl";

import type { Meta, StoryObj } from "@storybook/react-native";

/** Args exposed to Storybook for the form-control playground. */
interface FormControlStoryArgs extends Omit<FormControlProps, "children"> {
  /** Validation feedback displayed for an invalid field. */
  errorMessage: string;
  /** Supporting copy displayed below the input. */
  helperText: string;
  /** Visible and programmatic field label. */
  label: string;
}

const meta = {
  title: "UI/FormControl",
  component: FormControl,
  args: {
    disabled: false,
    errorMessage: "Ce champ est requis.",
    helperText: "Utilisez votre adresse principale.",
    invalid: false,
    label: "Adresse e-mail",
    required: true,
    size: "md",
  },
  argTypes: {
    size: {
      control: "select",
      options: formControlSizes,
    },
  },
  render: FormControlPlayground,
} satisfies Meta<FormControlStoryArgs>;

export default meta;

/** Story type inferred from the form-control meta configuration. */
type Story = StoryObj<typeof meta>;

/** Controllable form-control playground. */
export const Playground: Story = {};

/** Normal, invalid, and disabled field states. */
export const States: Story = {
  render: FormControlStatesStory,
};

/** Every form-control text size in the design system. */
export const Sizes: Story = {
  render: FormControlSizesStory,
};

/** Renders one completely related form control. */
function FormControlPlayground({
  errorMessage,
  helperText,
  label,
  ...props
}: FormControlStoryArgs) {
  return (
    <StoryFrame>
      <FormControlSample
        {...props}
        errorMessage={errorMessage}
        helperText={helperText}
        label={label}
        nativeId="storybook-form-control-playground"
      />
    </StoryFrame>
  );
}

/** Renders common validation and interaction states. */
function FormControlStatesStory() {
  return (
    <StoryFrame>
      <FormControlSample
        errorMessage=""
        helperText="Aucun problème détecté."
        label="État normal"
        nativeId="storybook-form-control-normal"
        required
      />
      <FormControlSample
        errorMessage="Corrigez la valeur pour continuer."
        helperText="La valeur doit rester lisible."
        invalid
        label="État invalide"
        nativeId="storybook-form-control-invalid"
        required
      />
      <FormControlSample
        disabled
        errorMessage=""
        helperText="Champ indisponible pour le moment."
        label="État désactivé"
        nativeId="storybook-form-control-disabled"
      />
    </StoryFrame>
  );
}

/** Renders all supported form-control text scales. */
function FormControlSizesStory() {
  return (
    <StoryFrame>
      {formControlSizes.map((size) => (
        <FormControlSample
          key={size}
          errorMessage=""
          helperText={`Copie secondaire ${size}`}
          label={`Taille ${size}`}
          nativeId={`storybook-form-control-${size}`}
          size={size}
        />
      ))}
    </StoryFrame>
  );
}

/** Props needed by one complete form-control sample. */
interface FormControlSampleProps extends Omit<
  FormControlStoryArgs,
  "className"
> {
  /** Stable relation stem used by Storybook's mounted samples. */
  nativeId: string;
}

/** Renders label, input, description, and conditional message together. */
function FormControlSample({
  disabled,
  errorMessage,
  helperText,
  invalid,
  label,
  nativeId,
  required,
  size,
}: FormControlSampleProps) {
  return (
    <FormControl
      disabled={disabled}
      invalid={invalid}
      nativeID={nativeId}
      required={required}
      size={size}
    >
      <FormControlLabel>{label}</FormControlLabel>
      <FormControlInput
        accessibilityLabel={label}
        placeholder="nom@exemple.com"
      />
      <FormControlDescription>{helperText}</FormControlDescription>
      <FormControlMessage>{errorMessage}</FormControlMessage>
    </FormControl>
  );
}

/** Provides consistent themed spacing for form-control stories. */
function StoryFrame({ children }: { children: React.ReactNode }) {
  return <View className="bg-background gap-6 p-6">{children}</View>;
}
