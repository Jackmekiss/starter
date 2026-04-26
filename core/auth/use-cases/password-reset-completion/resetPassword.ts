import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { AuthActionResult, ResetPasswordPayload } from "../../apis/types";

export const resetPasswordBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">
) => ({
  resetPassword: build.mutation<AuthActionResult, ResetPasswordPayload>({
    query: (payload) => ({
      url: "/password/reset",
      method: "POST",
      body: payload,
      params: undefined
    })
  })
});
