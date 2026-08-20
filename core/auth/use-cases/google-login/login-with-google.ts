import { setAuth } from "@core/auth/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { AuthContext } from "@core/auth/apis/types";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that authenticates through Google Sign In.
 */
export function loginWithGoogleBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, never, "authApi">,
  authGateway: AuthGateway,
) {
  return {
    loginWithGoogle: build.mutation<AuthContext, void>({
      queryFn: async () =>
        toRtkQueryResult(await authGateway.loginWithGoogle()),
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
