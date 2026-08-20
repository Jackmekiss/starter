import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { sessionBuilder } from "@core/auth/domain/builders/session-builder";
import { createStore } from "@core/init-redux-store";

import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by Apple login behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Apple Login", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should store auth state when Apple login succeeds", async () => {
    const accountId = "apple-account-id";
    const email = "apple@example.com";
    const account = accountBuilder().withId(accountId).withEmail(email).build();
    const user = authUserBuilder().withId(accountId).withEmail(email).build();
    const session = sessionBuilder().withUserId(accountId).build();

    authGateway.account = account;
    authGateway.authUser = user;
    authGateway.session = session;

    await loginWithApple();

    expectAuthState({
      account,
      session,
      user,
    });
  });

  it("should reject with auth error without changing durable state", async () => {
    authGateway.account = null;
    authGateway.authUser = null;

    await expect(loginWithApple()).rejects.toEqual({
      kind: "business",
      code: "INVALID_CREDENTIALS",
      retryable: false,
    });

    expect(store.getState().auth.status).toBe("idle");
  });

  /**
   * Dispatches the Apple login use-case.
   */
  async function loginWithApple() {
    await store.dispatch(authApi.endpoints.loginWithApple.initiate()).unwrap();
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
