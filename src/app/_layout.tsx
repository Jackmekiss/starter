import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Toast from "react-native-toast-message";
import "../global.css";
import { RootAppProviders } from "./root-app-providers";
import { RootNavigator } from "./root-navigator";

export * from "./app-runtime";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

export const unstable_settings = {
  initialRouteName: "/(auth)/index",
};
export default function AppLayout() {
  return (
    <RootAppProviders>
      <RootNavigator />
      <StatusBar />
      <Toast />
    </RootAppProviders>
  );
}
