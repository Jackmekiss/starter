import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { AuthActionResult, ResetPasswordPayload } from "../../apis/types";

export function resetPasswordBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
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
