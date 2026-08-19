import { setAuth } from "@core/auth/domain/slice";

import type { AuthContext } from "@core/auth/apis/types";
import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that authenticates through Google Sign In.
 */
export function loginWithGoogleBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    loginWithGoogle: build.mutation<AuthContext, void>({
      query: () => ({
        url: "/login/google",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
