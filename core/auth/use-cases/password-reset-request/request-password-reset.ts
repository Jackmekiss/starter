import type { RequestPasswordResetPayload } from "@core/auth/apis/types";
import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that requests a password reset email.
 */
export function requestPasswordResetBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    requestPasswordReset: build.mutation<void, RequestPasswordResetPayload>({
      query: (payload) => ({
        url: "/password/request-reset",
        method: "POST",
        body: payload,
      }),
    }),
  };
}
