import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "../global.css";
import { RootAppProviders } from "./root-app-providers";
import { RootNavigator } from "./root-navigator";

export * from "./app-runtime";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
  initialRouteName: "/(auth)/index",
};
export default function TabLayout() {
  return (
    <RootAppProviders>
      <RootNavigator />
      <StatusBar />
    </RootAppProviders>
  );
}
