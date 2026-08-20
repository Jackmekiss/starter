import { Stack } from "expo-router";

import { useRetrieveAccountQuery } from "@/app-runtime/runtime/auth-runtime";
import { useAppReadiness } from "@/hooks/app-shell/useAppReadiness";
import { useSelector } from "@/hooks/redux-hooks";
import {
  selectCurrentAccount,
  selectIsConnected,
} from "@core/auth/adapters/selectors/auth-selectors";

/**
 * Chooses the active route group from session and onboarding state.
 */
export function RootNavigator() {
  const account = useSelector(selectCurrentAccount);
  const isConnected = useSelector(selectIsConnected);
  const { isLoading: isRetrievingAccount } = useRetrieveAccountQuery(
    undefined,
    {
      skip: !isConnected,
      refetchOnMountOrArgChange: true,
    },
  );

  useAppReadiness(isRetrievingAccount);

  const shouldCompleteOnboarding =
    isConnected && account !== null && account.onboardingStatus !== "completed";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isConnected}>
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
