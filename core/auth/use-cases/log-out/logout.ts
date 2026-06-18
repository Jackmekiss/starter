import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { clearAuth, markLogoutRequested } from "../../domain/slice";

export const logoutBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) => ({
  logout: build.mutation<void, void>({
    query: () => ({
      url: "/logout",
      method: "POST",
    }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      dispatch(markLogoutRequested());
      await queryFulfilled;

      dispatch(clearAuth());
    },
  }),
});
