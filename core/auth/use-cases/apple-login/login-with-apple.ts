import { setAuth } from "@core/auth/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { AuthContext } from "@core/auth/apis/types";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that authenticates through Apple Sign In.
 */
export function loginWithAppleBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, "Auth", "authApi">,
  authGateway: AuthGateway,
) {
  return {
    loginWithApple: build.mutation<AuthContext, void>({
      queryFn: async () => toRtkQueryResult(await authGateway.loginWithApple()),
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
