import { setCurrentAccount } from "@core/account/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AccountApiBaseQueryFn } from "@core/account/apis/account-api-base-query";
import type { Account } from "@core/account/domain/account";
import type { AccountGateway } from "@core/account/gateways/account-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/** Retrieves account builder. */
export function retrieveAccountBuilder(
  build: EndpointBuilder<AccountApiBaseQueryFn, never, "accountApi">,
  gateway: AccountGateway,
) {
  return {
    retrieveAccount: build.query<Account, void>({
      queryFn: async () => toRtkQueryResult(await gateway.retrieveAccount()),
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
