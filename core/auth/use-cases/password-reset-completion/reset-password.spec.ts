import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { createStore } from "@core/init-redux-store";

import type { ResetPasswordPayload } from "@core/auth/apis/types";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by password reset completion behavior specs.
 */
function createAuthApi(authBaseQuery: InMemoryAuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Password Reset Completion", () => {
  let store: ReduxStore;
  let authBaseQuery: InMemoryAuthBaseQuery;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authBaseQuery = new InMemoryAuthBaseQuery();
    authApi = createAuthApi(authBaseQuery);
    store = createStore({ authApi }, {});
  });

  it("should reset password", async () => {
    const result = await resetPassword({
      password: "new-password",
      recoveryUrl: "starter://reset-password",
    });

    expect(result).toEqual({
      success: true,
    });
    expect(store.getState().auth.status).toBe("idle");
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
