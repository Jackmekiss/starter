import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { sessionBuilder } from "@core/auth/domain/builders/session-builder";
import { createStore } from "@core/init-redux-store";

import type { RegisterPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by registration behavior specs.
 */
function createAuthApi(authBaseQuery: InMemoryAuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Registration", () => {
  let store: ReduxStore;
  let authBaseQuery: InMemoryAuthBaseQuery;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authBaseQuery = new InMemoryAuthBaseQuery();
    authApi = createAuthApi(authBaseQuery);
    store = createStore({ authApi }, {});
  });

  it("should register account and store auth state", async () => {
    authBaseQuery.session = sessionBuilder().withUserId("1").build();

    const result = await register({
      email: "registered@example.com",
      firstName: "Registered",
      lastName: "User",
      password: "password",
    });

    if (!result.success || !result.account) {
      throw new Error("Expected registered account.");
    }

    const { account } = result;

    expectAuthState({
      account,
      session: sessionBuilder().withUserId("1").build(),
      user: authUserBuilder()
        .withId("1")
        .withEmail("registered@example.com")
        .build(),
    });
    expect(account).toEqual({
      avatarUri: null,
      createdAt: expect.any(String),
      email: "registered@example.com",
      firstName: "Registered",
      id: "1",
      lastName: "User",
      onboardingStatus: "pending",
    });
  });

  /**
   * Dispatches the registration use-case.
   */
  async function register(payload: RegisterPayload) {
    return store
      .dispatch(authApi.endpoints.register.initiate(payload))
      .unwrap();
  }

  /**
   * Expects successful registration data to be stored in auth state.
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
      error: null,
      logoutRequested: false,
      session,
      status: "success",
      user,
    });
  }
});
