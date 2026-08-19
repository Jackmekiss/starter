import { setAuth } from "@core/auth/domain/slice";

import type { AuthContext } from "@core/auth/apis/types";
import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that authenticates through Apple Sign In.
 */
export function loginWithAppleBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    loginWithApple: build.mutation<AuthContext, void>({
      query: () => ({
        url: "/login/apple",
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
