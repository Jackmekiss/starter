import { setAccount } from "@core/auth/domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { UpdateAccountPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";

/**
 * Builds the endpoint that marks onboarding as completed for the account.
 */
export function completeOnboardingBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
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
        const { data } = await queryFulfilled;

        dispatch(setAccount(data));
      },
    }),
  };
}
