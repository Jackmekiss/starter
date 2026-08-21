import { DarkTheme, DefaultTheme } from "expo-router/react-navigation";

import type { ColorSchemeName } from "react-native";

/** Color schemes supported by the Starter design tokens. */
export type AppColorScheme = "dark" | "light";

/** Resolves nullable or unspecified system appearance to a supported scheme. */
export function resolveAppColorScheme(
  colorScheme: ColorSchemeName,
): AppColorScheme {
  return colorScheme === "dark" ? "dark" : "light";
}

const tintColorLight = "#234b7e";
const tintColorDark = "#7aacd8";

export const Colors = {
  light: {
    text: "#171717",
    background: "#ffffff",
    canvas: "#f6f6f6",
    card: "#ffffff",
    tint: tintColorLight,
    icon: "#737373",
    tabIconDefault: "#737373",
    tabIconSelected: tintColorLight,
    accent: "#d4eaf8",
    border: "#dddcdb",
  },
  dark: {
    text: "#f5f5f5",
    background: "#121212",
    canvas: "#181719",
    card: "#272625",
    tint: tintColorDark,
    icon: "#d4d4d4",
    tabIconDefault: "#a3a3a3",
    tabIconSelected: tintColorDark,
    accent: "#112b5a",
    border: "#535252",
  },
};

export const THEME = {
  light: {
    canvas: "#f6f6f6",
    background: "#ffffff",
    bodyForeground: "#525252",
    foreground: "#171717",
    card: "#ffffff",
    cardForeground: "#171717",
    popover: "#ffffff",
    popoverForeground: "#171717",
    primary: "#234b7e",
    primaryForeground: "#ffffff",
    primarySoft: "#d4eaf8",
    primaryStrong: "#06143c",
    primaryBorder: "#7aacd8",
    controlBorderStrong: "#737474",
    controlSubtle: "#d5d4d4",
    divider: "#414141",
    secondary: "#f2f1f1",
    secondaryForeground: "#262627",
    tertiary: "#e78128",
    tertiaryForeground: "#272625",
    tertiaryStrong: "#6c3d13",
    muted: "#f2f1f1",
    mutedForeground: "#737373",
    accent: "#d4eaf8",
    accentForeground: "#112b5a",
    destructive: "#ff2d3f",
    destructiveForeground: "#ffffff",
    destructiveSoft: "#ffe0d5",
    success: "#0b7a2e",
    successSoft: "#cef8cb",
    warning: "#ff6c2d",
    warningSoft: "#ffecd5",
    info: "#1c5fef",
    infoSoft: "#d1e5fe",
    border: "#dddcdb",
    input: "#dcdbdb",
    track: "#dcdbdb",
    ring: "#7aacd8",
    radius: "0.5rem",
  },
  dark: {
    canvas: "#181719",
    background: "#121212",
    bodyForeground: "#d4d4d4",
    foreground: "#f5f5f5",
    card: "#272625",
    cardForeground: "#f5f5f5",
    popover: "#272625",
    popoverForeground: "#f5f5f5",
    primary: "#7aacd8",
    primaryForeground: "#06143c",
    primarySoft: "#112b5a",
    primaryStrong: "#d4eaf8",
    primaryBorder: "#234b7e",
    controlBorderStrong: "#a3a3a3",
    controlSubtle: "#414040",
    divider: "#dbdbdc",
    secondary: "#414040",
    secondaryForeground: "#f5f5f5",
    tertiary: "#fdb474",
    tertiaryForeground: "#272625",
    tertiaryStrong: "#ffe9d5",
    muted: "#414040",
    mutedForeground: "#d4d4d4",
    accent: "#112b5a",
    accentForeground: "#d4eaf8",
    destructive: "#ff8d81",
    destructiveForeground: "#7a083b",
    destructiveSoft: "#7a083b",
    success: "#61d76f",
    successSoft: "#023a2a",
    warning: "#ffb781",
    warningSoft: "#7a0c08",
    info: "#75a8fa",
    infoSoft: "#051972",
    border: "#535252",
    input: "#535252",
    track: "#535252",
    ring: "#7aacd8",
    radius: "0.5rem",
  },
};

export const NAV_THEME: Record<AppColorScheme, typeof DefaultTheme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
