import { setAccount } from "@core/auth/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { UpdateAccountPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that marks onboarding as completed for the account.
 */
export function completeOnboardingBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, "Auth", "authApi">,
  authGateway: AuthGateway,
) {
  return {
    completeOnboarding: build.mutation<Account, void>({
      queryFn: async () =>
        toRtkQueryResult(
          await authGateway.updateAccount({
            onboardingStatus: "completed",
          } satisfies UpdateAccountPayload),
        ),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccount(data));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
