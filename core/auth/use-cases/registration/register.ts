import { setAuth } from "@core/auth/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { AuthContext, RegisterPayload } from "@core/auth/apis/types";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that registers an account and stores the auth session.
 */
export function registerBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, never, "authApi">,
  authGateway: AuthGateway,
) {
  return {
    register: build.mutation<AuthContext, RegisterPayload>({
      queryFn: async (payload) =>
        toRtkQueryResult(await authGateway.register(payload)),
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
