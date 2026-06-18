import { setAccount } from "../../domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { Account } from "../../domain/account";

/**
 * Builds the endpoint that retrieves and stores the current account profile.
 */
export function retrieveAccountBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
) {
  return {
    retrieveAccount: build.query<Account | null, void>({
      query: (params) => ({
        url: "/retrieve",
        method: "GET",
        params,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(setAccount(data));
      },
    }),
  };
}
