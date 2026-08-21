import * as ProgressPrimitive from "@rn-primitives/progress";
import { cva } from "class-variance-authority";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

/** Visual sizes supported by the shared progress indicator. */
type ProgressSize = "2xl" | "lg" | "md" | "sm" | "xl" | "xs";

const progressSizes: ProgressSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

const progressTrackVariants = cva(
  "bg-track relative w-full overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-1",
        sm: "h-2",
        md: "h-3",
        lg: "h-3",
        xl: "h-5",
        "2xl": "h-6",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

const progressLabelVariants = cva("text-muted-foreground text-right", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
      xl: "text-base",
      "2xl": "text-base",
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

/** Props accepted by the shared progress indicator. */
type ProgressProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Root>,
  "accessibilityLabel" | "children" | "className"
> & {
  /** Localized accessible name for the progress indicator. */
  accessibilityLabel: string;
  /** Additional classes applied to the full progress-and-label stack. */
  className?: string;
  /** Additional classes applied to the filled portion of the track. */
  indicatorClassName?: string;
  /** Optional visible and announced progress description. */
  label?: string;
  /** Additional classes applied to the visible label. */
  labelClassName?: string;
  /** Visual track thickness. */
  size?: ProgressSize;
  /** Additional classes applied to the background track. */
  trackClassName?: string;
};

/** Resolves an invalid maximum to the primitive's canonical default. */
function resolveProgressMaximum(maximum: number) {
  return Number.isFinite(maximum) && maximum > 0 ? maximum : 100;
}

/** Clamps an unknown determinate value to the track's supported range. */
function resolveProgressValue(
  value: number | null | undefined,
  maximum: number,
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), maximum);
}

/**
 * Accessible determinate progress indicator with Fifteen's thickness scale.
 */
function Progress({
  className,
  getValueLabel,
  indicatorClassName,
  label,
  labelClassName,
  max = 100,
  size = "xs",
  trackClassName,
  value = 0,
  ...props
}: ProgressProps) {
  const resolvedMaximum = resolveProgressMaximum(max);
  const resolvedValue = resolveProgressValue(value, resolvedMaximum);
  const percentage = (resolvedValue / resolvedMaximum) * 100;

  /** Keeps the spoken value synchronized with the optional visible label. */
  function resolveValueLabel(currentValue: number, maximum: number) {
    return (
      getValueLabel?.(currentValue, maximum) ??
      label ??
      `${Math.round((currentValue / maximum) * 100)}%`
    );
  }

  return (
    <View className={cn("w-full items-end gap-2", className)}>
      <ProgressPrimitive.Root
        className={cn(progressTrackVariants({ size }), trackClassName)}
        getValueLabel={resolveValueLabel}
        max={resolvedMaximum}
        value={resolvedValue}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "bg-primary h-full rounded-full transition-all",
            indicatorClassName,
          )}
          style={{ width: `${percentage}%` }}
        />
      </ProgressPrimitive.Root>
      {label ? (
        <Text
          accessibilityElementsHidden
          accessible={false}
          className={cn(progressLabelVariants({ size }), labelClassName)}
          importantForAccessibility="no"
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export { Progress, progressSizes };
export type { ProgressProps, ProgressSize };
