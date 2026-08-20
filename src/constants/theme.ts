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

const tintColorLight = "hsl(0 0% 20.5%)";
const tintColorDark = "hsl(0 0% 98.5%)";

export const Colors = {
  light: {
    text: "hsl(0 0% 14.5%)",
    background: "hsl(0 0% 100%)",
    canvas: "hsl(0 0% 97%)",
    card: "hsl(0 0% 100%)",
    tint: tintColorLight,
    icon: "hsl(0 0% 55.6%)",
    tabIconDefault: "hsl(0 0% 55.6%)",
    tabIconSelected: tintColorLight,
    accent: "hsl(0 0% 97%)",
    border: "hsl(0 0% 92.2%)",
  },
  dark: {
    text: "hsl(0 0% 98.5%)",
    background: "hsl(0 0% 20.5%)",
    canvas: "hsl(0 0% 14.5%)",
    card: "hsl(0 0% 14.5%)",
    tint: tintColorDark,
    icon: "hsl(0 0% 70.8%)",
    tabIconDefault: "hsl(0 0% 55.6%)",
    tabIconSelected: tintColorDark,
    accent: "hsl(0 0% 26.9%)",
    border: "hsl(0 0% 26.9%)",
  },
};

export const THEME = {
  light: {
    canvas: "hsl(0 0% 97%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 14.5%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(0 0% 14.5%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(0 0% 14.5%)",
    primary: "hsl(0 0% 20.5%)",
    primaryForeground: "hsl(0 0% 98.5%)",
    secondary: "hsl(0 0% 97%)",
    secondaryForeground: "hsl(0 0% 20.5%)",
    muted: "hsl(0 0% 97%)",
    mutedForeground: "hsl(0 0% 55.6%)",
    accent: "hsl(0 0% 97%)",
    accentForeground: "hsl(0 0% 20.5%)",
    destructive: "hsl(0 84.2% 60.2%)",
    border: "hsl(0 0% 92.2%)",
    input: "hsl(0 0% 92.2%)",
    ring: "hsl(0 0% 70.8%)",
    radius: "0.625rem",
  },
  dark: {
    canvas: "hsl(0 0% 14.5%)",
    background: "hsl(0 0% 20.5%)",
    foreground: "hsl(0 0% 98.5%)",
    card: "hsl(0 0% 14.5%)",
    cardForeground: "hsl(0 0% 98.5%)",
    popover: "hsl(0 0% 14.5%)",
    popoverForeground: "hsl(0 0% 98.5%)",
    primary: "hsl(0 0% 98.5%)",
    primaryForeground: "hsl(0 0% 20.5%)",
    secondary: "hsl(0 0% 26.9%)",
    secondaryForeground: "hsl(0 0% 98.5%)",
    muted: "hsl(0 0% 26.9%)",
    mutedForeground: "hsl(0 0% 70.8%)",
    accent: "hsl(0 0% 26.9%)",
    accentForeground: "hsl(0 0% 98.5%)",
    destructive: "hsl(0 62.8% 50.6%)",
    border: "hsl(0 0% 26.9%)",
    input: "hsl(0 0% 26.9%)",
    ring: "hsl(0 0% 55.6%)",
    radius: "0.625rem",
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
