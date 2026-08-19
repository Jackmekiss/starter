import { setAccount } from "@core/auth/domain/slice";

import type { UpdateAccountPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that updates account profile fields.
 */
export function updateAccountBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    updateAccount: build.mutation<Account, UpdateAccountPayload>({
      query: (payload) => ({
        url: "/update",
        method: "POST",
        body: payload,
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
