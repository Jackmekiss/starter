import { setAuth, setError, setLoading } from "@core/auth/domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { AuthResult } from "@core/auth/apis/types";

/**
 * Builds the endpoint that authenticates through Apple Sign In.
 */
export function loginWithAppleBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
) {
  return {
    loginWithApple: build.mutation<AuthResult, void>({
      query: () => ({
        url: "/login/apple",
        method: "POST",
        body: undefined,
        params: undefined,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading());

        const { data } = await queryFulfilled;

        if (data.success) {
          dispatch(setAuth(data));
          return;
        }

        dispatch(setError(data.error));
      },
    }),
  };
}
