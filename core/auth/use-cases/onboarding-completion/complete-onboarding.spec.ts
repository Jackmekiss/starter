import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { createStore } from "@core/init-redux-store";

import type { Account } from "@core/auth/domain/account";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by onboarding completion behavior specs.
 */
function createAuthApi(authBaseQuery: InMemoryAuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Onboarding Completion", () => {
  let store: ReduxStore;
  let authBaseQuery: InMemoryAuthBaseQuery;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authBaseQuery = new InMemoryAuthBaseQuery();
    authApi = createAuthApi(authBaseQuery);
    store = createStore({ authApi }, {});
  });

  it("should mark account onboarding as completed", async () => {
    authBaseQuery.account = accountBuilder()
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
