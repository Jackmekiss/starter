import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { createStore } from "@core/init-redux-store";

import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by account deletion behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Account Deletion", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should delete account", async () => {
    authGateway.authUser = authUserBuilder()
      .withId("1")
      .withEmail("account@example.com")
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
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.session).toBeNull();
  }
});
