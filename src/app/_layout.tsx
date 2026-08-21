import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";

import "@/global.css";
import { RootAppProviders } from "@/app-runtime/root-app-providers";
import { RootNavigator } from "@/app-runtime/root-navigator";
import { toastConfig } from "@/components/ui/Toast";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

// Expo Router requires this export name exactly; it cannot be camelCased.
// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
  initialRouteName: "/(auth)/index",
};

/**
 * Root app layout that wires providers, navigation, status bar, and toasts.
 */
export default function AppLayout() {
  return (
    <KeyboardProvider
      navigationBarTranslucent
      preserveEdgeToEdge
      statusBarTranslucent
    >
      <RootAppProviders>
        <RootNavigator />
        <StatusBar />
        <Toast config={toastConfig} />
      </RootAppProviders>
    </KeyboardProvider>
  );
}
