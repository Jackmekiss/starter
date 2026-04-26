import { DarkTheme, DefaultTheme } from "@react-navigation/native";

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
    accent: "hsl(0 0% 97%)",
    border: "hsl(0 0% 92.2%)",
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
};

export const NAV_THEME: Record<"light" | "dark", any> = {
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
  },
};
