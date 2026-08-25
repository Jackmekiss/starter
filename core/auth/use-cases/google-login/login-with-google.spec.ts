import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { createStore } from "@core/init-redux-store";

import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by Google login behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Google Login", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should expose Google as unavailable without changing auth state", async () => {
    await expect(loginWithGoogle()).rejects.toEqual({
      kind: "business",
      code: "PROVIDER_UNAVAILABLE",
      retryable: false,
    });
    expect(store.getState().auth).toEqual({ session: null, user: null });
  });

  /**
   * Dispatches the Google login use-case.
   */
  async function loginWithGoogle() {
    await store.dispatch(authApi.endpoints.loginWithGoogle.initiate()).unwrap();
  }
});
