import { createApi } from "@reduxjs/toolkit/query/react";

import { appMode } from "@/app-runtime/runtime/app-mode";

import { FakeAuthBaseQuery } from "@core/auth/adapters/fake/fake-auth-base-query";
import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";

import type { AuthBaseQuery } from "@core/auth/gateways/auth-base-query";

/**
 * Creates the auth gateway implementation for the current app runtime mode.
 */
function createAuthBaseQuery(): AuthBaseQuery {
  if (appMode === "fake") {
    return new FakeAuthBaseQuery();
  }

  return new InMemoryAuthBaseQuery();
}

export const authApi = createApi(
  createAuthApiOptions(createAuthBaseQuery().handle()),
);

export const {
  useRetrieveAccountQuery,
  useUpdateAccountMutation,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLoginWithAppleMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useDeleteAccountMutation,
  useLogoutMutation,
} = authApi;
