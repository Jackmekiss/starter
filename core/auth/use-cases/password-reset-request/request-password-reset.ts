import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { RequestPasswordResetPayload } from "@core/auth/apis/types";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that requests a password reset email.
 */
export function requestPasswordResetBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, never, "authApi">,
  authGateway: AuthGateway,
) {
  return {
    requestPasswordReset: build.mutation<void, RequestPasswordResetPayload>({
      queryFn: async (payload) =>
        toRtkQueryResult(await authGateway.requestPasswordReset(payload)),
    }),
  };
}
