import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { Account } from "../../domain/account";
import { setAccount } from "../../domain/slice";

export const retrieveAccountBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) => ({
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
});
