import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

/**
 * Dismisses the splash after persisted state and auth bootstrap have completed.
 */
export function useAppReadiness() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
}
