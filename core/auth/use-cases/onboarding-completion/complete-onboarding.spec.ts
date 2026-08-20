import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { createStore } from "@core/init-redux-store";

import type { Account } from "@core/auth/domain/account";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by onboarding completion behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Onboarding Completion", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should mark account onboarding as completed", async () => {
    authGateway.account = accountBuilder()
      .withId("onboarding-account")
      .withOnboardingStatus("pending")
      .build();

    await completeOnboarding();

    const account = accountBuilder()
      .withId("onboarding-account")
      .withOnboardingStatus("completed")
      .build();

    expectAccount(account);
  });

  /**
   * Dispatches the onboarding completion use-case.
   */
  async function completeOnboarding() {
    await store
      .dispatch(authApi.endpoints.completeOnboarding.initiate())
      .unwrap();
  }

  /**
   * Expects the completed account to be stored in auth state.
   */
  function expectAccount(accountExpected: Account) {
    expect(store.getState().auth.account).toEqual(accountExpected);
  }
});
