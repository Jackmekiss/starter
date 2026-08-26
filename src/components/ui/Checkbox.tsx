import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { cva } from "class-variance-authority";
import { Check, Minus } from "lucide-react-native";
import { Platform } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

/** Checked states supported by the shared checkbox. */
type CheckboxCheckedState = boolean | "indeterminate";

/** Visual sizes supported by the shared checkbox. */
type CheckboxSize = "lg" | "md" | "sm";

const checkboxSizes: CheckboxSize[] = ["sm", "md", "lg"];

const checkboxVariants = cva(
  cn(
    "border-control-border-strong bg-background shrink-0 items-center justify-center border-2 shadow-sm shadow-black/5",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed",
      native: "overflow-hidden",
    }),
  ),
  {
    variants: {
      checked: {
        false: "",
        true: "border-primary",
      },
      invalid: {
        false: "",
        true: "border-destructive",
      },
      size: {
        sm: "size-4 rounded-md",
        md: "size-5 rounded-lg",
        lg: "size-6 rounded-lg",
      },
    },
    defaultVariants: {
      checked: false,
      invalid: false,
      size: "md",
    },
  },
);

const checkboxIndicatorVariants = cva(
  "h-full w-full items-center justify-center",
  {
    variants: {
      invalid: {
        false: "bg-primary",
        true: "bg-destructive",
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

const checkboxIconVariants = cva("text-primary-foreground", {
  variants: {
    size: {
      sm: "size-3",
      md: "size-4",
      lg: "size-4.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const checkboxLabelVariants = cva("text-secondary-foreground font-body", {
  variants: {
    size: {
      sm: "text-sm leading-[21px]",
      md: "text-base leading-6",
      lg: "text-lg leading-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const CHECKBOX_HIT_SLOP: Record<CheckboxSize, number> = {
  sm: 14,
  md: 12,
  lg: 10,
};

/** Props accepted by the shared checkbox primitive. */
type CheckboxProps = Omit<
  ComponentProps<typeof CheckboxPrimitive.Root>,
  "accessibilityLabel" | "checked" | "children" | "onCheckedChange"
> & {
  /** Localized accessible name for the standalone control. */
  accessibilityLabel: string;
  /** Current binary or indeterminate checked state. */
  checked: CheckboxCheckedState;
  /** Additional classes applied to the checked indicator. */
  indicatorClassName?: string;
  /** Shows the destructive validation treatment. */
  invalid?: boolean;
  /** Additional classes applied to the checked-state icon. */
  iconClassName?: string;
  /** Receives the next binary state after activation. */
  onCheckedChange: (checked: boolean) => void;
  /** Visual size shared by the box and checked-state icon. */
  size?: CheckboxSize;
};

/**
 * Accessible checkbox with design-system sizes and validation states.
 */
function Checkbox({
  accessibilityState,
  checked,
  className,
  disabled = false,
  hitSlop,
  iconClassName,
  indicatorClassName,
  invalid = false,
  onCheckedChange,
  size = "md",
  ...props
}: CheckboxProps) {
  const isChecked = checked === true;
  const isIndeterminate = checked === "indeterminate";
  const isVisuallyChecked = isChecked || isIndeterminate;
  const CheckedIcon = isIndeterminate ? Minus : Check;

  return (
    <CheckboxPrimitive.Root
      accessibilityState={{
        ...accessibilityState,
        checked: isIndeterminate ? "mixed" : isChecked,
        disabled,
      }}
      aria-checked={isIndeterminate ? "mixed" : isChecked}
      aria-invalid={invalid}
      checked={isChecked}
      className={cn(
        checkboxVariants({
          checked: isVisuallyChecked,
          invalid,
          size,
        }),
        disabled && "opacity-40",
        className,
      )}
      disabled={disabled}
      hitSlop={hitSlop ?? CHECKBOX_HIT_SLOP[size]}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          checkboxIndicatorVariants({ invalid }),
          indicatorClassName,
        )}
        forceMount={isIndeterminate ? true : undefined}
      >
        <Icon
          accessible={false}
          as={CheckedIcon}
          className={cn(checkboxIconVariants({ size }), iconClassName)}
          importantForAccessibility="no"
          strokeWidth={Platform.OS === "web" ? 2.5 : 3.5}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxLabelVariants, checkboxSizes, checkboxVariants };
export type { CheckboxCheckedState, CheckboxProps, CheckboxSize };
