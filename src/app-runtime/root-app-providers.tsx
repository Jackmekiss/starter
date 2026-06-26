import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { type PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/app-runtime/app-runtime";

/**
 * Props for the RootAppProviders component.
 */
type RootAppProvidersProps = PropsWithChildren;

/**
 * Composes global runtime providers required by every route.
 */
export function RootAppProviders({ children }: RootAppProvidersProps) {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProvider value={DefaultTheme}>{children}</ThemeProvider>
            </PersistGate>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
