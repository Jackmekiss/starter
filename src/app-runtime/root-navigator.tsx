import { Stack } from "expo-router";
import { useSelector } from "react-redux";

import { useRetrieveAccountQuery } from "@/app-runtime/app-runtime";
import { useAppReadiness } from "@/hooks/app-shell/useAppReadiness";
import useSessionStore from "@/stores/session-store";

import type { RootState } from "@core/init-redux-store";

/**
 * Chooses the active route group from session and onboarding state.
 */
export function RootNavigator() {
  const { isConnected } = useSessionStore();
  const account = useSelector((state: RootState) => state.auth.account);
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const { isFetching: isRetrievingAccount } = useRetrieveAccountQuery();

  useAppReadiness(isRetrievingAccount);

  const shouldCompleteOnboarding =
    isConnected &&
    authStatus === "success" &&
    account?.onboardingStatus !== "completed";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isConnected && !shouldCompleteOnboarding}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isConnected && !shouldCompleteOnboarding}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={isConnected && shouldCompleteOnboarding}>
        <Stack.Screen name="(on-boarding)" />
      </Stack.Protected>
    </Stack>
  );
}
