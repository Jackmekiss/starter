import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { UpdateAccountPayload } from "../../apis/types";
import { Account } from "../../domain/account";
import { setAccount } from "../../domain/slice";

export const updateAccountBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">
) => ({
  updateAccount: build.mutation<Account, UpdateAccountPayload>({
    query: (payload) => ({
      url: "/update",
      method: "POST",
      body: payload
    }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      const { data } = await queryFulfilled;

      dispatch(setAccount(data));
    }
  })
});
