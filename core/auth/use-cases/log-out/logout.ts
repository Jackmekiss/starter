import { clearAuth } from "@core/auth/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that logs out and clears local auth state.
 */
export function logoutBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, never, "authApi">,
  authGateway: AuthGateway,
) {
  return {
    logout: build.mutation<void, void>({
      queryFn: async () => toRtkQueryResult(await authGateway.logout()),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // RTK Query owns the transient request failure.
        } finally {
          dispatch(clearAuth());
        }
      },
    }),
  };
}
