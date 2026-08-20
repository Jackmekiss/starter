import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { ResetPasswordPayload } from "@core/auth/apis/types";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that completes a password reset challenge.
 */
export function resetPasswordBuilder(
  build: EndpointBuilder<AuthApiBaseQueryFn, never, "authApi">,
  authGateway: AuthGateway,
) {
  return {
    resetPassword: build.mutation<void, ResetPasswordPayload>({
      queryFn: async (payload) =>
        toRtkQueryResult(await authGateway.resetPassword(payload)),
    }),
  };
}
