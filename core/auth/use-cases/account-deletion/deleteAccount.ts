import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { clearAuth, markLogoutRequested } from "../../domain/slice";

export const deleteAccountBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) => ({
  deleteAccount: build.mutation<void, void>({
    query: () => ({
      url: "/delete",
      method: "POST",
    }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      dispatch(markLogoutRequested());
      await queryFulfilled;

      dispatch(clearAuth());
    },
  }),
});
