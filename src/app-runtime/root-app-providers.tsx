import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "expo-router/react-navigation";
import { type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/app-runtime/runtime/store-runtime";
import { NAV_THEME, resolveAppColorScheme } from "@/constants/theme";
import { LocalizationProvider } from "@/localization/localization-provider";

/**
 * Props for the RootAppProviders component.
 */
type RootAppProvidersProps = PropsWithChildren;

/**
 * Composes global runtime providers required by every route.
 */
export function RootAppProviders({ children }: RootAppProvidersProps) {
  const colorScheme = resolveAppColorScheme(useColorScheme());

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <PersistGate loading={null} persistor={persistor}>
              <LocalizationProvider>
                <ThemeProvider value={NAV_THEME[colorScheme]}>
                  {children}
                </ThemeProvider>
              </LocalizationProvider>
            </PersistGate>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
