import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { createStore } from "@core/init-redux-store";

import type { RequestPasswordResetPayload } from "@core/auth/apis/types";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by password reset request behavior specs.
 */
function createAuthApi(authBaseQuery: InMemoryAuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Password Reset Request", () => {
  let store: ReduxStore;
  let authBaseQuery: InMemoryAuthBaseQuery;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authBaseQuery = new InMemoryAuthBaseQuery();
    authApi = createAuthApi(authBaseQuery);
    store = createStore({ authApi }, {});
  });

  it("should request password reset", async () => {
    const result = await requestPasswordReset({
      email: "reset@example.com",
    });

    expect(result).toEqual({
      success: true,
    });
    expect(store.getState().auth.status).toBe("idle");
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
