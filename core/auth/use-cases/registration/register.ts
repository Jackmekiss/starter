import { setAuth } from "@core/auth/domain/slice";

import type { AuthContext, RegisterPayload } from "@core/auth/apis/types";
import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that registers an account and stores the auth session.
 */
export function registerBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    register: build.mutation<AuthContext, RegisterPayload>({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
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
