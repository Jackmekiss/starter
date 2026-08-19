import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { InMemorySessionStorage } from "@core/auth/adapters/in-memory/in-memory-session-storage";
import { SessionPersistingAuthBaseQuery } from "@core/auth/adapters/session-storage/session-persisting-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { createStore } from "@core/init-redux-store";

import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by logout behavior specs.
 */
function createAuthApi(authBaseQuery: SessionPersistingAuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Log Out", () => {
  let store: ReduxStore;
  let authBaseQuery: InMemoryAuthBaseQuery;
  let sessionStorage: InMemorySessionStorage;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authBaseQuery = new InMemoryAuthBaseQuery();
    sessionStorage = new InMemorySessionStorage();
    authApi = createAuthApi(
      new SessionPersistingAuthBaseQuery(authBaseQuery, sessionStorage),
    );
    store = createStore({ authApi }, {});
  });

  it("should clear local auth state", async () => {
    const account = accountBuilder().withId("1").build();
    authBaseQuery.account = account;
    authBaseQuery.authUser = authUserBuilder()
      .withId(account.id)
      .withEmail(account.email)
      .build();

    await login();

    await logout();

    expectClearedAuthState();
    expect(sessionStorage.session).toBeNull();
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
    expect(store.getState().auth.status).toBe("idle");
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.session).toBeNull();
    expect(store.getState().auth.account).toBeNull();
  }
});
