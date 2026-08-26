import { useTheme } from "expo-router";
import * as React from "react";
import { Switch as NativeSwitch } from "react-native";

import { THEME } from "@/constants/theme";
import { cn } from "@/lib/cn";

/** Visual sizes supported by the shared switch. */
type SwitchSize = "lg" | "md" | "sm";

const switchSizes: SwitchSize[] = ["sm", "md", "lg"];

const switchScales: Record<SwitchSize, number> = {
  sm: 0.75,
  md: 1,
  lg: 1.25,
};

/** Props accepted by the native animated switch through its local contract. */
type SwitchProps = Omit<
  React.ComponentProps<typeof NativeSwitch>,
  | "accessibilityLabel"
  | "ios_backgroundColor"
  | "onValueChange"
  | "thumbColor"
  | "trackColor"
  | "value"
> & {
  /** Localized accessible name for the switch. */
  accessibilityLabel: string;
  /** Controlled checked state. */
  checked: boolean;
  /** Handles changes emitted by the native control. */
  onCheckedChange: (checked: boolean) => void;
  /** Shows the destructive validation treatment. */
  invalid?: boolean;
  /** Visual size applied to the native control. */
  size?: SwitchSize;
  /** Retained for source compatibility; native platforms own thumb rendering. */
  thumbClassName?: string;
  /** Localized spoken value such as “On” or “Off”. */
  valueLabel: string;
};

/** Native switch preserving platform animation and the local component API. */
const Switch = React.forwardRef<
  React.ComponentRef<typeof NativeSwitch>,
  SwitchProps
>(
  (
    {
      accessibilityLabel,
      accessibilityRole = "switch",
      accessibilityState,
      checked,
      className,
      disabled = false,
      hitSlop = 8,
      invalid = false,
      onCheckedChange,
      size = "md",
      style,
      thumbClassName: _thumbClassName,
      valueLabel,
      ...props
    },
    ref,
  ) => {
    const theme = THEME[useTheme().dark ? "dark" : "light"];
    const inactiveTrackColor = invalid ? theme.destructive : theme.track;

    return (
      <NativeSwitch
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityState={{
          ...accessibilityState,
          checked,
          disabled,
        }}
        aria-invalid={invalid}
        aria-valuetext={valueLabel}
        className={cn(
          "web:cursor-pointer",
          disabled && "opacity-40 web:cursor-not-allowed",
          className,
        )}
        disabled={disabled}
        hitSlop={hitSlop}
        ios_backgroundColor={inactiveTrackColor}
        onValueChange={onCheckedChange}
        style={[{ transform: [{ scale: switchScales[size] }] }, style]}
        thumbColor={checked ? theme.primaryForeground : theme.mutedForeground}
        trackColor={{
          false: inactiveTrackColor,
          true: invalid ? theme.destructive : theme.primary,
        }}
        value={checked}
        {...props}
      />
    );
  },
);

Switch.displayName = "Switch";

export { Switch, switchSizes };
export type { SwitchProps, SwitchSize };
