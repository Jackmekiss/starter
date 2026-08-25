import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { authUserBuilder } from "@core/auth/domain/builders/auth-user-builder";
import { sessionBuilder } from "@core/auth/domain/builders/session-builder";
import { createStore } from "@core/init-redux-store";

import type { RegisterPayload } from "@core/auth/apis/types";
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
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should register an identity and store auth state", async () => {
    authGateway.session = sessionBuilder().withUserId("auth-user-id").build();

    const result = await register({
      email: "registered@example.com",
      password: "password",
    });

    expectAuthState({
      session: sessionBuilder().withUserId("auth-user-id").build(),
      user: authUserBuilder()
        .withId("auth-user-id")
        .withEmail("registered@example.com")
        .build(),
    });
    expect(result).toEqual(store.getState().auth);
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
    session,
    user,
  }: {
    session: Session;
    user: AuthUser;
  }) {
    expect(store.getState().auth).toEqual({
      session,
      user,
    });
  }
});
