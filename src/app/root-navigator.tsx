import { Stack } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../core/init-redux-store";
import { useAppReadiness } from "../hooks/app-shell/useAppReadiness";

import useSessionStore from "../stores/session-store";
import { useRetrieveAccountQuery } from "./app-runtime";

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
