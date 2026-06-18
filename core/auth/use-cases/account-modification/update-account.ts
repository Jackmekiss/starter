import { setAccount } from "@core/auth/domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { UpdateAccountPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";

/**
 * Builds the endpoint that updates account profile fields.
 */
export function updateAccountBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
) {
  return {
    updateAccount: build.mutation<Account, UpdateAccountPayload>({
      query: (payload) => ({
        url: "/update",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(setAccount(data));
      },
    }),
  };
}
