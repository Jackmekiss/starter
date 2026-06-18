import { setAuth, setError, setLoading } from "../../domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { AuthResult } from "../../apis/types";

/**
 * Builds the endpoint that authenticates through Google Sign In.
 */
export function loginWithGoogleBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
) {
  return {
    loginWithGoogle: build.mutation<AuthResult, void>({
      query: () => ({
        url: "/login/google",
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
