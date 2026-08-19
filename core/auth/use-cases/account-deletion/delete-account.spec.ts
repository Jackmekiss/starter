import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { createStore } from "@core/init-redux-store";

import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by account deletion behavior specs.
 */
function createAuthApi(authBaseQuery: InMemoryAuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Account Deletion", () => {
  let store: ReduxStore;
  let authBaseQuery: InMemoryAuthBaseQuery;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authBaseQuery = new InMemoryAuthBaseQuery();
    authApi = createAuthApi(authBaseQuery);
    store = createStore({ authApi }, {});
  });

  it("should delete account", async () => {
    const account = accountBuilder().withId("1").build();
    authBaseQuery.account = account;
    authBaseQuery.authUser = authUserBuilder()
      .withId(account.id)
      .withEmail(account.email)
      .build();

    await login();

    await deleteAccount();

    expectAccountDeleted();
  });

  /**
   * Dispatches the log-in use-case to create an authenticated state.
   */
  async function login() {
    await store
      .dispatch(
        authApi.endpoints.login.initiate({
          email: "account@example.com",
          password: "secure-password",
        }),
      )
      .unwrap();
  }

  /**
   * Dispatches the account deletion use-case.
   */
  async function deleteAccount() {
    await store.dispatch(authApi.endpoints.deleteAccount.initiate()).unwrap();
  }

  /**
   * Expects auth state to be cleared after account deletion.
   */
  function expectAccountDeleted() {
    expect(store.getState().auth.status).toBe("idle");
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.session).toBeNull();
    expect(store.getState().auth.account).toBeNull();
  }
});
