import { clearAuth } from "@core/auth/domain/slice";

import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that deletes the current account and clears auth state.
 */
export function deleteAccountBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    deleteAccount: build.mutation<void, void>({
      query: () => ({
        url: "/delete",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAuth());
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
