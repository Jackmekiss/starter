import { Stack } from "expo-router";
import { useEffect } from "react";

import { useProvisionAccountMutation } from "@/app-runtime/runtime/account-runtime";
import { resolveRootNavigationState } from "@/app-runtime/runtime/root-navigation-state";
import { AccountBootstrapError } from "@/components/app-shell/AccountBootstrapError";
import { useAppReadiness } from "@/hooks/app-shell/useAppReadiness";
import { useSelector } from "@/hooks/redux-hooks";
import { selectCurrentAccount } from "@core/account/adapters/selectors/account-selectors";
import {
  selectCurrentUser,
  selectIsConnected,
} from "@core/auth/adapters/selectors/auth-selectors";

const STORYBOOK_ROUTE_ENABLED =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

/**
 * Chooses the active route group from session and onboarding state.
 */
export function RootNavigator() {
  const account = useSelector(selectCurrentAccount);
  const currentUser = useSelector(selectCurrentUser);
  const isConnected = useSelector(selectIsConnected);
  const [provisionAccount, provisioning] = useProvisionAccountMutation();
  const currentUserId = currentUser?.id;

  useEffect(() => {
    if (!isConnected || !currentUserId) return;

    provisionAccount()
      .unwrap()
      .catch(() => undefined);
  }, [currentUserId, isConnected, provisionAccount]);

  const isProvisioningAccount =
    isConnected && (provisioning.isUninitialized || provisioning.isLoading);

  const navigationState = resolveRootNavigationState({
    account,
    isConnected,
    isPreparingAccount: isProvisioningAccount,
  });

  useAppReadiness(navigationState === "splash");

  if (navigationState === "splash") return null;

  if (navigationState === "account-error") {
    return (
      <AccountBootstrapError
        isRetrying={provisioning.isLoading}
        onRetry={() => {
          provisionAccount()
            .unwrap()
            .catch(() => undefined);
        }}
      />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={navigationState === "auth"}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={navigationState === "tabs"}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={navigationState === "onboarding"}>
        <Stack.Screen name="(on-boarding)" />
      </Stack.Protected>
      <Stack.Protected guard={STORYBOOK_ROUTE_ENABLED}>
        <Stack.Screen name="storybook" />
      </Stack.Protected>
    </Stack>
  );
}
