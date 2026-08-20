import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { createStore } from "@core/init-redux-store";

import type { ResetPasswordPayload } from "@core/auth/apis/types";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by password reset completion behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Password Reset Completion", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should reset password", async () => {
    const result = await resetPassword({
      password: "new-password",
      recoveryUrl: "starter://reset-password",
    });

    expect(result).toBeUndefined();
    expect(store.getState().auth).toEqual({
      account: null,
      session: null,
      user: null,
    });
  });

  /**
   * Dispatches the password reset completion use-case.
   */
  async function resetPassword(payload: ResetPasswordPayload) {
    return store
      .dispatch(authApi.endpoints.resetPassword.initiate(payload))
      .unwrap();
  }
});
