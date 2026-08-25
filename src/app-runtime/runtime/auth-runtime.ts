import { createListenerMiddleware } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import { appMode } from "@/app-runtime/runtime/app-mode";
import { authSessionProvider } from "@/app-runtime/runtime/auth-session-provider";
import { FakeAuthGateway } from "@core/auth/adapters/fake/fake-auth-gateway";
import { HttpAuthGateway } from "@core/auth/adapters/http/http-auth-gateway";
import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { clearAuth } from "@core/auth/domain/slice";

import type { AuthGateway } from "@core/auth/gateways/auth-gateway";

/**
 * Creates the auth gateway implementation for the current app runtime mode.
 */
function createAuthGateway(): AuthGateway {
  if (appMode === "http") {
    return new HttpAuthGateway({
      baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL ?? "",
      sessionProvider: authSessionProvider,
    });
  }

  if (appMode === "fake") {
    return new FakeAuthGateway(3000);
  }

  return new InMemoryAuthGateway();
}

export const authApi = createApi(createAuthApiOptions(createAuthGateway()));

export const authSessionListenerMiddleware = createListenerMiddleware();

authSessionListenerMiddleware.startListening({
  actionCreator: clearAuth,
  effect: (_, { dispatch }) => {
    dispatch(authApi.util.resetApiState());
  },
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLoginWithAppleMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useDeleteAccountMutation,
  useLogoutMutation,
} = authApi;
