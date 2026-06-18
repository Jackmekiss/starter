import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type {
  AuthActionResult,
  RequestPasswordResetPayload,
} from "../../apis/types";

export function requestPasswordResetBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
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
