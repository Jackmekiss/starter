import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { FakeAuthGateway } from "@core/auth/adapters/fake/fake-auth-gateway";
import { HttpAuthGateway } from "@core/auth/adapters/http/http-auth-gateway";
import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { sessionBuilder } from "@core/auth/domain/builders/session-builder";
import { createStore } from "@core/init-redux-store";

import type { LoginPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by log-in behavior specs.
 */
function createAuthApi(authGateway: AuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Log In", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should store auth state when credentials are accepted", async () => {
    const accountId = "login-account-id";
    const email = "login@example.com";
    const account = accountBuilder().withId(accountId).withEmail(email).build();
    const user = authUserBuilder().withId(accountId).withEmail(email).build();
    const session = sessionBuilder().withUserId(accountId).build();

    authGateway.account = account;
    authGateway.authUser = user;
    authGateway.session = session;

    await login({
      email,
      password: "password",
    });

    expectAuthState({
      account,
      session,
      user,
    });
  });

  it("should reject with auth error without changing durable state", async () => {
    authGateway.account = null;
    authGateway.authUser = null;

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

  it("should map a backend login code before RTK Query rejects", async () => {
    useAuthGateway(
      createHttpAuthGateway(
        new Response(
          JSON.stringify({
            code: "email_not_verified",
            message: "Raw backend detail must not cross the adapter.",
          }),
          {
            status: 422,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    await expect(
      login({ email: "pending@example.com", password: "password" }),
    ).rejects.toEqual({
      kind: "business",
      code: "EMAIL_NOT_CONFIRMED",
      retryable: false,
    });

    expectUnauthenticatedState();
  });

  it("should map an HTTP service failure before RTK Query rejects", async () => {
    useAuthGateway(createHttpAuthGateway(new Response(null, { status: 503 })));

    await expect(
      login({ email: "user@example.com", password: "password" }),
    ).rejects.toEqual({
      kind: "unavailable",
      retryable: true,
    });

    expectUnauthenticatedState();
  });

  it("should propagate an injected fake failure through the same contract", async () => {
    const fakeAuthGateway = new FakeAuthGateway(0);
    fakeAuthGateway.error = { kind: "network", retryable: true };
    useAuthGateway(fakeAuthGateway);

    await expect(
      login({ email: "user@example.com", password: "password" }),
    ).rejects.toEqual({
      kind: "network",
      retryable: true,
    });

    expectUnauthenticatedState();
  });

  /**
   * Dispatches the login use-case.
   */
  async function login(payload: LoginPayload) {
    await store.dispatch(authApi.endpoints.login.initiate(payload)).unwrap();
  }

  /** Rebuilds the test API and store around one adapter implementation. */
  function useAuthGateway(nextAuthGateway: AuthGateway) {
    authApi = createAuthApi(nextAuthGateway);
    store = createStore({ authApi }, {});
  }

  /** Creates the HTTP adapter around one deterministic response. */
  function createHttpAuthGateway(response: Response) {
    return new HttpAuthGateway({
      baseUrl: "https://auth.example.test",
      sessionProvider: { getSession: () => null },
      fetcher: async () => response,
    });
  }

  /** Expects a failed login not to mutate durable authentication state. */
  function expectUnauthenticatedState() {
    expect(store.getState().auth).toEqual({
      account: null,
      session: null,
      status: "idle",
      user: null,
    });
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
