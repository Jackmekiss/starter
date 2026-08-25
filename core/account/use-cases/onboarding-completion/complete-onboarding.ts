import { setCurrentAccount } from "@core/account/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AccountApiBaseQueryFn } from "@core/account/apis/account-api-base-query";
import type { Account } from "@core/account/domain/account";
import type { AccountGateway } from "@core/account/gateways/account-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/** Builds the mutation that completes onboarding and refreshes durable Account state. */
export function completeOnboardingBuilder(
  build: EndpointBuilder<AccountApiBaseQueryFn, never, "accountApi">,
  gateway: AccountGateway,
) {
  return {
    completeOnboarding: build.mutation<Account, void>({
      queryFn: async () => toRtkQueryResult(await gateway.completeOnboarding()),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setCurrentAccount((await queryFulfilled).data));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
