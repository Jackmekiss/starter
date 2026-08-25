import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { cva } from "class-variance-authority";
import * as React from "react";
import { Platform, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { ComponentProps, ReactNode } from "react";

/** Visual sizes supported by radio controls. */
type RadioSize = "lg" | "md" | "sm";

const radioSizes: RadioSize[] = ["sm", "md", "lg"];

/** State shared by a radio group and its items. */
interface RadioGroupContextValue {
  /** Prevents every item in the group from changing. */
  disabled: boolean;
  /** Shows the destructive validation state for every item. */
  invalid: boolean;
  /** Shared visual size for indicators and labels. */
  size: RadioSize;
  /** Currently selected item value. */
  value: string | undefined;
}

/** State shared by one radio item and its optional label. */
interface RadioItemContextValue {
  /** Prevents this radio item from changing. */
  disabled: boolean;
  /** Visual size inherited by the item label. */
  size: RadioSize;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);
const RadioItemContext = React.createContext<RadioItemContextValue | null>(
  null,
);

const radioItemVariants = cva(
  cn(
    "flex-row items-center justify-start",
    Platform.select({
      web: "focus-visible:ring-ring/50 cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed",
    }),
  ),
  {
    variants: {
      size: {
        sm: "gap-1.5",
        md: "gap-2",
        lg: "gap-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const radioIndicatorVariants = cva(
  "border-control-border bg-background shrink-0 items-center justify-center rounded-full border-2 shadow-sm shadow-black/5",
  {
    variants: {
      invalid: {
        false: "",
        true: "border-destructive",
      },
      selected: {
        false: "",
        true: "border-primary",
      },
      size: {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      invalid: false,
      selected: false,
      size: "md",
    },
    compoundVariants: [
      {
        className: "border-destructive",
        invalid: true,
        selected: true,
      },
    ],
  },
);

const radioDotVariants = cva("rounded-full", {
  variants: {
    invalid: {
      false: "bg-primary",
      true: "bg-destructive",
    },
    size: {
      sm: "size-2",
      md: "size-3",
      lg: "size-4",
    },
  },
  defaultVariants: {
    invalid: false,
    size: "md",
  },
});

const radioLabelVariants = cva("text-foreground font-body", {
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

const RADIO_HIT_SLOP: Record<RadioSize, number> = {
  sm: 14,
  md: 12,
  lg: 10,
};

/** Props accepted by a radio group. */
type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root> & {
  /** Shows the destructive validation state for every item. */
  invalid?: boolean;
  /** Shared visual size for group items. */
  size?: RadioSize;
};

/** Props accepted by one radio-group item. */
type RadioGroupItemProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Item>,
  "accessibilityLabel"
> & {
  /** Localized accessible name for the option. */
  accessibilityLabel: string;
  /** Optional visible label rendered inside the radio press target. */
  children?: ReactNode;
  /** Additional classes applied to the selected-state dot. */
  dotClassName?: string;
  /** Additional classes applied to the circular indicator. */
  indicatorClassName?: string;
  /** Overrides the group's validation state for this item. */
  invalid?: boolean;
  /** Overrides the group's visual size for this item. */
  size?: RadioSize;
};

/** Props accepted by a radio item label. */
type RadioGroupLabelProps = ComponentProps<typeof Text>;

/** Reads the owning radio-group contract. */
function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext);

  if (context === null) {
    throw new Error("RadioGroupItem must be rendered inside RadioGroup.");
  }

  return context;
}

/** Reads the owning radio-item contract. */
function useRadioItemContext() {
  const context = React.useContext(RadioItemContext);

  if (context === null) {
    throw new Error("RadioGroupLabel must be rendered inside RadioGroupItem.");
  }

  return context;
}

/** Accessible radio group that propagates size and validation state. */
function RadioGroup({
  accessibilityState,
  className,
  disabled = false,
  invalid = false,
  size = "md",
  value,
  ...props
}: RadioGroupProps) {
  const context = React.useMemo<RadioGroupContextValue>(
    () => ({
      disabled,
      invalid,
      size,
      value,
    }),
    [disabled, invalid, size, value],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <RadioGroupPrimitive.Root
        accessibilityState={{ ...accessibilityState, disabled }}
        aria-invalid={invalid}
        className={cn("gap-2", className)}
        disabled={disabled}
        value={value}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

/** Radio option with one semantic press target for indicator and label. */
function RadioGroupItem({
  accessibilityState,
  children,
  className,
  disabled: disabledProp = false,
  dotClassName,
  hitSlop,
  indicatorClassName,
  invalid: invalidProp,
  size: sizeProp,
  value,
  ...props
}: RadioGroupItemProps) {
  const group = useRadioGroupContext();
  const disabled = group.disabled || disabledProp === true;
  const invalid = invalidProp ?? group.invalid;
  const selected = group.value === value;
  const size = sizeProp ?? group.size;
  const itemContext = React.useMemo<RadioItemContextValue>(
    () => ({ disabled, size }),
    [disabled, size],
  );

  return (
    <RadioItemContext.Provider value={itemContext}>
      <RadioGroupPrimitive.Item
        accessibilityState={{
          ...accessibilityState,
          checked: selected,
          disabled,
        }}
        aria-invalid={invalid}
        className={cn(
          radioItemVariants({ size }),
          disabled && "opacity-40",
          className,
        )}
        disabled={disabled}
        hitSlop={hitSlop ?? RADIO_HIT_SLOP[size]}
        value={value}
        {...props}
      >
        <View
          accessible={false}
          className={cn(
            radioIndicatorVariants({ invalid, selected, size }),
            indicatorClassName,
          )}
          importantForAccessibility="no"
        >
          <RadioGroupPrimitive.Indicator
            className={cn(radioDotVariants({ invalid, size }), dotClassName)}
          />
        </View>
        {children}
      </RadioGroupPrimitive.Item>
    </RadioItemContext.Provider>
  );
}

/** Visible label inheriting the owning radio item's size and disabled state. */
function RadioGroupLabel({ className, ...props }: RadioGroupLabelProps) {
  const { disabled, size } = useRadioItemContext();

  return (
    <Text
      className={cn(
        radioLabelVariants({ size }),
        disabled && "opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupLabel, radioSizes };
export type {
  RadioGroupItemProps,
  RadioGroupLabelProps,
  RadioGroupProps,
  RadioSize,
};
