import { setAccount } from "@core/auth/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { Account } from "@core/auth/domain/account";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that retrieves and stores the current account profile.
 */
export function retrieveAccountBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, "Auth", "authApi">,
  authGateway: AuthGateway,
) {
  return {
    retrieveAccount: build.query<Account | null, void>({
      queryFn: async () =>
        toRtkQueryResult(await authGateway.retrieveAccount()),
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
