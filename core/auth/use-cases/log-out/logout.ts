import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { clearAuth, markLogoutRequested } from "../../domain/slice";

export function logoutBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) {
  return {
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
  };
}
