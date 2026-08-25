import { setCurrentAccount } from "@core/account/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AccountApiBaseQueryFn } from "@core/account/apis/account-api-base-query";
import type { UpdateAccountPayload } from "@core/account/apis/types";
import type { Account } from "@core/account/domain/account";
import type { AccountGateway } from "@core/account/gateways/account-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/** Updates account builder. */
export function updateAccountBuilder(
  build: EndpointBuilder<AccountApiBaseQueryFn, never, "accountApi">,
  gateway: AccountGateway,
) {
  return {
    updateAccount: build.mutation<Account, UpdateAccountPayload>({
      queryFn: async (payload) =>
        toRtkQueryResult(await gateway.updateAccount(payload)),
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
