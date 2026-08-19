import { setAccount } from "@core/auth/domain/slice";

import type { UpdateAccountPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that marks onboarding as completed for the account.
 */
export function completeOnboardingBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    completeOnboarding: build.mutation<Account, void>({
      query: () => ({
        url: "/update",
        method: "POST",
        body: {
          onboardingStatus: "completed",
        } satisfies UpdateAccountPayload,
      }),
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
