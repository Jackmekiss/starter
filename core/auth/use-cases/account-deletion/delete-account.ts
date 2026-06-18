import { clearAuth, markLogoutRequested } from "@core/auth/domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that deletes the current account and clears auth state.
 */
export function deleteAccountBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
) {
  return {
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
  };
}
