import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { AuthActionResult, ResetPasswordPayload } from "../../apis/types";

/** Builds the endpoint that completes a password reset challenge. */
export function resetPasswordBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authApi">,
) {
  return {
    resetPassword: build.mutation<AuthActionResult, ResetPasswordPayload>({
      query: (payload) => ({
        url: "/password/reset",
        method: "POST",
        body: payload,
        params: undefined,
      }),
    }),
  };
}
