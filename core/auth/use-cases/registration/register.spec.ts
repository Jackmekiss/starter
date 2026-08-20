import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { sessionBuilder } from "@core/auth/domain/builders/session-builder";
import { createStore } from "@core/init-redux-store";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

import type { RegisterPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by registration behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Registration", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    const dateProvider = new DeterministicDateProvider();
    dateProvider.dateOfNow = new Date("2026-06-17T00:00:00.000Z");
    authGateway = new InMemoryAuthGateway(dateProvider);
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should register account and store auth state", async () => {
    authGateway.session = sessionBuilder().withUserId("1").build();

    const result = await register({
      email: "registered@example.com",
      firstName: "Registered",
      lastName: "User",
      password: "password",
    });

    if (!result.account) {
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
      createdAt: "2026-06-17T00:00:00.000Z",
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
      session,
      user,
    });
  }
});
