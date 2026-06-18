import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { UpdateAccountPayload } from "../../apis/types";
import type { Account } from "../../domain/account";
import { setAccount } from "../../domain/slice";

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
