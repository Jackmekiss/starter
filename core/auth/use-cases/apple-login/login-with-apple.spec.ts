import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { createStore } from "@core/init-redux-store";

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

  it("should expose Apple as unavailable without changing auth state", async () => {
    await expect(loginWithApple()).rejects.toEqual({
      kind: "business",
      code: "PROVIDER_UNAVAILABLE",
      retryable: false,
    });
    expect(store.getState().auth).toEqual({ session: null, user: null });
  });

  /**
   * Dispatches the Apple login use-case.
   */
  async function loginWithApple() {
    await store.dispatch(authApi.endpoints.loginWithApple.initiate()).unwrap();
  }
});
