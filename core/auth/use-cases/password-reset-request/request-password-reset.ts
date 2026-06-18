import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type {
  AuthActionResult,
  RequestPasswordResetPayload,
} from "@core/auth/apis/types";

/**
 * Builds the endpoint that requests a password reset email.
 */
export function requestPasswordResetBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
) {
  return {
    requestPasswordReset: build.mutation<
      AuthActionResult,
      RequestPasswordResetPayload
    >({
      query: (payload) => ({
        url: "/password/request-reset",
        method: "POST",
        body: payload,
        params: undefined,
      }),
    }),
  };
}
