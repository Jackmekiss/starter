import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { createStore } from "@core/init-redux-store";

import type { RequestPasswordResetPayload } from "@core/auth/apis/types";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by password reset request behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Password Reset Request", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should request password reset", async () => {
    const result = await requestPasswordReset({
      email: "reset@example.com",
    });

    expect(result).toBeUndefined();
    expect(store.getState().auth).toEqual({
      account: null,
      session: null,
      user: null,
    });
  });

  /**
   * Dispatches the password reset request use-case.
   */
  async function requestPasswordReset(payload: RequestPasswordResetPayload) {
    return store
      .dispatch(authApi.endpoints.requestPasswordReset.initiate(payload))
      .unwrap();
  }
});
