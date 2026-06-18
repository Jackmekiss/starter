import { clearAuth, markLogoutRequested } from "@core/auth/domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that logs out and clears local auth state.
 */
export function logoutBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
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
