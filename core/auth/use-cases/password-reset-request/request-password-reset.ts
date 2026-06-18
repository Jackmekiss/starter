import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import {
  AuthActionResult,
  RequestPasswordResetPayload,
} from "../../apis/types";

export const requestPasswordResetBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) => ({
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
});
