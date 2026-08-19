import type { ResetPasswordPayload } from "@core/auth/apis/types";
import type { AuthBaseQueryFn } from "@core/auth/gateways/auth-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that completes a password reset challenge.
 */
export function resetPasswordBuilder(
  build: EndpointBuilder<AuthBaseQueryFn, "Auth", "authApi">,
) {
  return {
    resetPassword: build.mutation<void, ResetPasswordPayload>({
      query: (payload) => ({
        url: "/password/reset",
        method: "POST",
        body: payload,
      }),
    }),
  };
}
