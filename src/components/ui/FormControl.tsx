import * as LabelPrimitive from "@rn-primitives/label";
import { cva } from "class-variance-authority";
import { CircleAlert } from "lucide-react-native";
import * as React from "react";
import {
  type GestureResponderEvent,
  Platform,
  type TextInput,
  View,
} from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { InputProps } from "@/components/ui/Input";
import type { ComponentProps, ForwardedRef, ReactNode, RefObject } from "react";

/** Visual sizes supported by the shared form-control family. */
type FormControlSize = "lg" | "md" | "sm";

const formControlSizes: FormControlSize[] = ["sm", "md", "lg"];

/** State and relations shared by one form-control compound component. */
interface FormControlContextValue {
  /** Native identifier assigned to the field control. */
  controlId: string;
  /** Native identifier assigned to supporting copy. */
  descriptionId: string;
  /** Prevents interaction with the field and its label. */
  disabled: boolean;
  /** Focus target used when the visible label is pressed. */
  inputRef: RefObject<TextInput | null>;
  /** Shows the destructive field state. */
  invalid: boolean;
  /** Native identifier assigned to the visible label. */
  labelId: string;
  /** Native identifier assigned to validation feedback. */
  messageId: string;
  /** Marks the field as required. */
  required: boolean;
  /** Shared visual size for label and feedback copy. */
  size: FormControlSize;
}

const FormControlContext = React.createContext<FormControlContextValue | null>(
  null,
);

const formControlLabelVariants = cva("text-foreground font-body-medium", {
  variants: {
    size: {
      sm: "text-sm leading-5",
      md: "text-base leading-6",
      lg: "text-lg leading-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const formControlCopyVariants = cva("min-w-0 flex-1", {
  variants: {
    size: {
      sm: "text-xs leading-4",
      md: "text-sm leading-5",
      lg: "text-base leading-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/** Props accepted by the form-control container. */
type FormControlProps = ComponentProps<typeof View> & {
  /** Disables the field and visible label interaction. */
  disabled?: boolean;
  /** Shows and announces validation feedback. */
  invalid?: boolean;
  /** Marks the field as required. */
  required?: boolean;
  /** Visual size shared by the field's textual parts. */
  size?: FormControlSize;
};

/** Props accepted by a form-control label. */
type FormControlLabelProps = Omit<
  ComponentProps<typeof LabelPrimitive.Root>,
  "children" | "disabled"
> & {
  /** Visible label content. */
  children: ReactNode;
  /** Classes applied to the label text rather than its pressable row. */
  textClassName?: string;
};

/** Props accepted by a form-control input. */
type FormControlInputProps = Omit<InputProps, "editable" | "nativeID"> & {
  /** Localized fallback name used by native screen readers. */
  accessibilityLabel: string;
  /** ID of visible copy that describes this field on the web. */
  "aria-describedby"?: string;
  /** Reports the field's validation state on the web. */
  "aria-invalid"?: boolean;
  /** ID of the visible label naming this field on the web. */
  "aria-labelledby"?: string;
  /** Allows a caller to make an otherwise enabled field read-only. */
  editable?: boolean;
};

/** Props accepted by supporting form-control copy. */
type FormControlDescriptionProps = Omit<
  ComponentProps<typeof Text>,
  "nativeID"
>;

/** Props accepted by validation feedback. */
type FormControlMessageProps = Omit<ComponentProps<typeof Text>, "nativeID"> & {
  /** Classes applied to the decorative validation icon. */
  iconClassName?: string;
};

/** Reads the compound form-control contract from its owning container. */
function useFormControlContext(componentName: string) {
  const context = React.useContext(FormControlContext);

  if (context === null) {
    throw new Error(`${componentName} must be rendered inside FormControl.`);
  }

  return context;
}

/** Provides field state, focus ownership, and deterministic relation IDs. */
function FormControl({
  children,
  className,
  disabled = false,
  invalid = false,
  nativeID: nativeId,
  required = false,
  size = "md",
  ...props
}: FormControlProps) {
  const generatedId = React.useId();
  const baseId = nativeId ?? `form-control-${generatedId}`;
  const inputRef = React.useRef<TextInput | null>(null);
  const context = React.useMemo<FormControlContextValue>(
    () => ({
      controlId: `${baseId}-control`,
      descriptionId: `${baseId}-description`,
      disabled,
      inputRef,
      invalid,
      labelId: `${baseId}-label`,
      messageId: `${baseId}-message`,
      required,
      size,
    }),
    [baseId, disabled, invalid, required, size],
  );

  return (
    <FormControlContext.Provider value={context}>
      <View
        className={cn("w-full items-start gap-1.5", className)}
        nativeID={nativeId}
        {...props}
      >
        {children}
      </View>
    </FormControlContext.Provider>
  );
}

/** Visible label that focuses its related input when pressed. */
function FormControlLabel({
  children,
  className,
  onPress,
  textClassName,
  ...props
}: FormControlLabelProps) {
  const { controlId, disabled, inputRef, labelId, required, size } =
    useFormControlContext("FormControlLabel");

  /** Focuses the related field before preserving a caller press handler. */
  function handlePress(event: GestureResponderEvent) {
    if (!disabled) {
      inputRef.current?.focus();
    }

    onPress?.(event);
  }

  return (
    <LabelPrimitive.Root
      className={cn(
        "w-full flex-row items-center",
        Platform.select({ web: "cursor-default select-none" }),
        disabled && "opacity-40",
        className,
      )}
      disabled={disabled}
      onPress={handlePress}
      {...props}
    >
      <LabelPrimitive.Text
        className={cn(formControlLabelVariants({ size }), textClassName)}
        htmlFor={controlId}
        nativeID={labelId}
      >
        {children}
      </LabelPrimitive.Text>
      {required ? (
        <Text
          accessibilityElementsHidden
          accessible={false}
          className="text-destructive ml-0.5"
          importantForAccessibility="no"
        >
          *
        </Text>
      ) : null}
    </LabelPrimitive.Root>
  );
}

/** Assigns the owned input reference while preserving a forwarded ref. */
function assignInputRef(
  instance: TextInput | null,
  inputRef: RefObject<TextInput | null>,
  forwardedRef: ForwardedRef<TextInput>,
) {
  inputRef.current = instance;

  if (typeof forwardedRef === "function") {
    forwardedRef(instance);
  } else if (forwardedRef !== null) {
    forwardedRef.current = instance;
  }
}

/** Input wired to its form-control label, supporting copy, and error state. */
const FormControlInput = React.forwardRef<TextInput, FormControlInputProps>(
  (
    {
      accessibilityLabel,
      accessibilityLabelledBy,
      accessibilityState,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-labelledby": ariaLabelledBy,
      className,
      editable = true,
      ...props
    },
    forwardedRef,
  ) => {
    const {
      controlId,
      descriptionId,
      disabled,
      inputRef,
      invalid,
      labelId,
      messageId,
      required,
    } = useFormControlContext("FormControlInput");
    const isEditable = editable && !disabled;

    /** Keeps the label focus target and caller ref synchronized. */
    function handleRef(instance: TextInput | null) {
      assignInputRef(instance, inputRef, forwardedRef);
    }

    return (
      <Input
        ref={handleRef}
        accessibilityLabel={accessibilityLabel}
        accessibilityLabelledBy={accessibilityLabelledBy ?? labelId}
        accessibilityState={{
          ...accessibilityState,
          disabled: !isEditable,
        }}
        aria-describedby={
          ariaDescribedBy ?? (invalid ? messageId : descriptionId)
        }
        aria-invalid={ariaInvalid ?? invalid}
        aria-labelledby={ariaLabelledBy ?? labelId}
        aria-required={required}
        className={cn(invalid && "border-destructive", className)}
        editable={isEditable}
        nativeID={controlId}
        {...props}
      />
    );
  },
);

FormControlInput.displayName = "FormControlInput";

/** Supporting copy programmatically associated with the related input. */
function FormControlDescription({
  className,
  ...props
}: FormControlDescriptionProps) {
  const { descriptionId, size } = useFormControlContext(
    "FormControlDescription",
  );

  return (
    <Text
      className={cn(
        "text-muted-foreground",
        formControlCopyVariants({ size }),
        className,
      )}
      nativeID={descriptionId}
      {...props}
    />
  );
}

/** Destructive validation copy announced once when the field is invalid. */
function FormControlMessage({
  children,
  className,
  iconClassName,
  ...props
}: FormControlMessageProps) {
  const { invalid, messageId, size } =
    useFormControlContext("FormControlMessage");

  if (!invalid) {
    return null;
  }

  return (
    <View className="w-full flex-row items-start gap-1">
      <Icon
        accessible={false}
        as={CircleAlert}
        className={cn(
          "text-destructive mt-0.5 shrink-0",
          size === "sm" && "size-4",
          size === "md" && "size-5",
          size === "lg" && "size-6",
          iconClassName,
        )}
        importantForAccessibility="no"
      />
      <Text
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        className={cn(
          "text-destructive",
          formControlCopyVariants({ size }),
          className,
        )}
        nativeID={messageId}
        {...props}
      >
        {children}
      </Text>
    </View>
  );
}

export {
  FormControl,
  FormControlDescription,
  FormControlInput,
  FormControlLabel,
  FormControlMessage,
  formControlSizes,
};
export type {
  FormControlDescriptionProps,
  FormControlInputProps,
  FormControlLabelProps,
  FormControlMessageProps,
  FormControlProps,
  FormControlSize,
};
