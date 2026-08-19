import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { InMemorySessionStorage } from "@core/auth/adapters/in-memory/in-memory-session-storage";
import { SessionPersistingAuthBaseQuery } from "@core/auth/adapters/session-storage/session-persisting-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { sessionBuilder } from "@core/auth/domain/builders/session-builder";
import { createStore } from "@core/init-redux-store";

import type { LoginPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by log-in behavior specs.
 */
function createAuthApi(authBaseQuery: SessionPersistingAuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Log In", () => {
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

  it("should store auth state when credentials are accepted", async () => {
    const accountId = "login-account-id";
    const email = "login@example.com";
    const account = accountBuilder().withId(accountId).withEmail(email).build();
    const user = authUserBuilder().withId(accountId).withEmail(email).build();
    const session = sessionBuilder().withUserId(accountId).build();

    authBaseQuery.account = account;
    authBaseQuery.authUser = user;
    authBaseQuery.session = session;

    await login({
      email,
      password: "password",
    });

    expectAuthState({
      account,
      session,
      user,
    });
    expect(sessionStorage.session).toEqual(session);
  });

  it("should reject with auth error without changing durable state", async () => {
    authBaseQuery.account = null;
    authBaseQuery.authUser = null;

    await expect(
      login({
        email: "missing@example.com",
        password: "password",
      }),
    ).rejects.toEqual({
      kind: "business",
      code: "INVALID_CREDENTIALS",
      retryable: false,
    });

    expect(store.getState().auth).toEqual({
      account: null,
      session: null,
      status: "idle",
      user: null,
    });
  });

  /**
   * Dispatches the login use-case.
   */
  async function login(payload: LoginPayload) {
    await store.dispatch(authApi.endpoints.login.initiate(payload)).unwrap();
  }

  /**
   * Expects successful authentication data to be stored in auth state.
   */
  function expectAuthState({
    account,
    session,
    user,
  }: {
    account: Account;
    session: Session;
    user: AuthUser;
  }) {
    expect(store.getState().auth).toEqual({
      account,
      session,
      status: "success",
      user,
    });
  }
});
