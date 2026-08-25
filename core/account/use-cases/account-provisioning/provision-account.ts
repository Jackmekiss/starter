import { setCurrentAccount } from "@core/account/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AccountApiBaseQueryFn } from "@core/account/apis/account-api-base-query";
import type { Account } from "@core/account/domain/account";
import type { AccountGateway } from "@core/account/gateways/account-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/** Provisions account builder. */
export function provisionAccountBuilder(
  build: EndpointBuilder<AccountApiBaseQueryFn, never, "accountApi">,
  gateway: AccountGateway,
) {
  return {
    provisionAccount: build.mutation<Account, void>({
      queryFn: async () => toRtkQueryResult(await gateway.provisionAccount()),
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
