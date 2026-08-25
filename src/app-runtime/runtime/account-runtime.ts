import { createListenerMiddleware } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import { appMode } from "@/app-runtime/runtime/app-mode";
import { FakeAccountGateway } from "@core/account/adapters/fake/fake-account-gateway";
import { InMemoryAccountGateway } from "@core/account/adapters/in-memory/in-memory-account-gateway";
import { createAccountApiOptions } from "@core/account/apis/account-api";
import { accountBuilder } from "@core/account/domain/builders/account-builder";
import { clearAccount } from "@core/account/domain/slice";
import { clearAuth, setAuth } from "@core/auth/domain/slice";

import type { AccountGateway } from "@core/account/gateways/account-gateway";
import type { RootState } from "@core/init-redux-store";

/** Creates the deterministic Account gateway selected by the current runtime mode. */
function createAccountGateway(): AccountGateway {
  if (appMode === "fake") {
    const gateway = new FakeAccountGateway();
    gateway.account = accountBuilder().build();

    return gateway;
  }

  const gateway = new InMemoryAccountGateway();
  gateway.account = accountBuilder().build();

  return gateway;
}

export const accountApi = createApi(
  createAccountApiOptions(createAccountGateway()),
);

export const accountSessionListenerMiddleware =
  createListenerMiddleware<RootState>();

accountSessionListenerMiddleware.startListening({
  actionCreator: clearAuth,
  effect: (_, { dispatch }) => {
    dispatch(clearAccount());
    dispatch(accountApi.util.resetApiState());
  },
});

accountSessionListenerMiddleware.startListening({
  actionCreator: setAuth,
  effect: (action, api) => {
    const previousIdentity = api.getOriginalState().auth.user?.id;

    if (previousIdentity && previousIdentity !== action.payload.user.id) {
      api.dispatch(clearAccount());
      api.dispatch(accountApi.util.resetApiState());
    }
  },
});

export const {
  useCompleteOnboardingMutation,
  useProvisionAccountMutation,
  useRetrieveAccountQuery,
  useUpdateAccountMutation,
} = accountApi;
