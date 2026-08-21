import { ThemeProvider } from "expo-router/react-navigation";
import { useEffect } from "react";
import { Appearance, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import "@/global.css";
import { BottomSheetModalProvider } from "@/components/ui/BottomSheetModal";
import { toastConfig } from "@/components/ui/Toast";
import { NAV_THEME, THEME } from "@/constants/theme";
import { LocalizationProvider } from "@/localization/localization-provider";

import type { Preview } from "@storybook/react-native";
import type { PropsWithChildren } from "react";
import type { AppColorScheme } from "@/constants/theme";

/** Props accepted by the presentation-only Storybook provider tree. */
interface StorybookProvidersProps extends PropsWithChildren {
  /** Appearance selected through Storybook's background toolbar. */
  colorScheme: AppColorScheme;
}

/** Maps Storybook's background global to an application appearance. */
function resolveStorybookColorScheme(backgrounds: unknown): AppColorScheme {
  if (
    backgrounds === null ||
    typeof backgrounds !== "object" ||
    !("value" in backgrounds)
  ) {
    return "light";
  }

  return backgrounds.value === "dark" ? "dark" : "light";
}

/** Mounts the presentation-only providers required by isolated UI stories. */
function StorybookProviders({
  children,
  colorScheme,
}: StorybookProvidersProps) {
  useEffect(() => {
    if (Platform.OS === "web") {
      const root = globalThis.document?.documentElement;
      const previousColorScheme = root?.getAttribute("data-color-scheme");
      root?.setAttribute("data-color-scheme", colorScheme);

      return () => {
        if (previousColorScheme === null || previousColorScheme === undefined) {
          root?.removeAttribute("data-color-scheme");
          return;
        }

        root?.setAttribute("data-color-scheme", previousColorScheme);
      };
    }

    const previousColorScheme = Appearance.getColorScheme() ?? "unspecified";
    Appearance.setColorScheme(colorScheme);

    return () => {
      Appearance.setColorScheme(previousColorScheme);
    };
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <LocalizationProvider>
          <ThemeProvider value={NAV_THEME[colorScheme]}>
            <BottomSheetModalProvider>
              <View className="bg-background flex-1 p-6">{children}</View>
              <Toast config={toastConfig} />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <StorybookProviders
        colorScheme={resolveStorybookColorScheme(context.globals.backgrounds)}
      >
        <Story />
      </StorybookProviders>
    ),
  ],
  initialGlobals: {
    backgrounds: {
      value: "light",
    },
  },
  parameters: {
    backgrounds: {
      options: {
        dark: { name: "Dark", value: THEME.dark.background },
        light: { name: "Light", value: THEME.light.background },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
