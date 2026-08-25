import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { createStore } from "@core/init-redux-store";

import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by logout behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Log Out", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should clear local auth state", async () => {
    authGateway.authUser = authUserBuilder()
      .withId("1")
      .withEmail("account@example.com")
      .build();

    await login();

    await logout();

    expectClearedAuthState();
  });

  it("should clear local auth state when remote logout fails", async () => {
    authGateway.authUser = authUserBuilder()
      .withId("1")
      .withEmail("account@example.com")
      .build();

    await login();

    authGateway.error = { kind: "network", retryable: true };

    await expect(logout()).rejects.toEqual({
      kind: "network",
      retryable: true,
    });
    expectClearedAuthState();
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
   * Dispatches the logout use-case.
   */
  async function logout() {
    await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
  }

  /**
   * Expects auth state to be cleared after logout.
   */
  function expectClearedAuthState() {
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.session).toBeNull();
  }
});
