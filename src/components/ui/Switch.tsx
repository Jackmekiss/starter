import * as SwitchPrimitive from "@rn-primitives/switch";
import { cva } from "class-variance-authority";
import { Platform } from "react-native";

import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

/** Visual sizes supported by the shared switch. */
type SwitchSize = "lg" | "md" | "sm";

const switchSizes: SwitchSize[] = ["sm", "md", "lg"];

const switchVariants = cva(
  cn(
    "shrink-0 flex-row items-center rounded-full border border-transparent p-0.5 shadow-sm shadow-black/5",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed",
    }),
  ),
  {
    variants: {
      checked: {
        false: "bg-track",
        true: "bg-primary",
      },
      invalid: {
        false: "",
        true: "bg-destructive",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-8 w-14",
      },
    },
    defaultVariants: {
      checked: false,
      invalid: false,
      size: "md",
    },
  },
);

const switchThumbVariants = cva(
  cn(
    "rounded-full transition-transform",
    Platform.select({ web: "pointer-events-none block" }),
  ),
  {
    variants: {
      checked: {
        false: "bg-muted-foreground translate-x-0",
        true: "bg-primary-foreground",
      },
      invalid: {
        false: "",
        true: "bg-destructive-foreground",
      },
      size: {
        sm: "size-4",
        md: "size-5",
        lg: "size-7",
      },
    },
    compoundVariants: [
      { checked: true, className: "translate-x-4", size: "sm" },
      { checked: true, className: "translate-x-5", size: "md" },
      { checked: true, className: "translate-x-6", size: "lg" },
    ],
    defaultVariants: {
      checked: false,
      invalid: false,
      size: "md",
    },
  },
);

/** Props accepted by the shared switch primitive. */
type SwitchProps = Omit<
  ComponentProps<typeof SwitchPrimitive.Root>,
  "accessibilityLabel" | "aria-valuetext"
> & {
  /** Localized accessible name for the switch. */
  accessibilityLabel: string;
  /** Shows the destructive validation treatment. */
  invalid?: boolean;
  /** Visual size shared by the track and thumb. */
  size?: SwitchSize;
  /** Additional classes applied to the movable thumb. */
  thumbClassName?: string;
  /** Localized spoken value such as “On” or “Off”. */
  valueLabel: string;
};

/** Accessible switch with Fifteen's size and validation variants. */
function Switch({
  accessibilityState,
  checked,
  className,
  disabled = false,
  hitSlop = 8,
  invalid = false,
  size = "md",
  thumbClassName,
  valueLabel,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      accessibilityState={{
        ...accessibilityState,
        checked,
        disabled,
      }}
      aria-invalid={invalid}
      aria-valuetext={valueLabel}
      checked={checked}
      className={cn(
        switchVariants({ checked, invalid, size }),
        disabled && "opacity-40",
        className,
      )}
      disabled={disabled}
      hitSlop={hitSlop}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          switchThumbVariants({ checked, invalid, size }),
          thumbClassName,
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchSizes, switchVariants };
export type { SwitchProps, SwitchSize };
