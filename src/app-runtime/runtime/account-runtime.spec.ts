import { describe, expect, it } from "vitest";

import {
  accountApi,
  accountSessionListenerMiddleware,
} from "@/app-runtime/runtime/account-runtime";
import { clearAuth, setAuth } from "@core/auth/domain/slice";
import { createStore } from "@core/init-redux-store";

describe("Account runtime identity ownership", () => {
  it("clears Account state and cache on logout", async () => {
    const store = createRuntimeStore();

    store.dispatch(setAuth(authContext("owner-a")));
    await store
      .dispatch(accountApi.endpoints.provisionAccount.initiate())
      .unwrap();

    store.dispatch(clearAuth());

    expect(store.getState().account.current).toBeNull();
    expectAccountCacheCleared(store.getState());
  });

  it("clears Account when the authenticated identity changes", async () => {
    const store = createRuntimeStore();

    store.dispatch(setAuth(authContext("owner-a")));
    await store
      .dispatch(accountApi.endpoints.provisionAccount.initiate())
      .unwrap();

    store.dispatch(setAuth(authContext("owner-b")));

    expect(store.getState().account.current).toBeNull();
    expectAccountCacheCleared(store.getState());
  });
});

/** Creates the actual Account API/listener composition without persistence. */
function createRuntimeStore() {
  return createStore({ accountApi }, {}, undefined, undefined, [
    accountSessionListenerMiddleware.middleware,
  ]);
}

/** Builds one authenticated identity with a matching provider-neutral session. */
function authContext(identity: string) {
  return {
    user: { id: identity, email: `${identity}@example.test` },
    session: { userId: identity, accessToken: `${identity}-access-token` },
  };
}

/** Verifies the dynamically mounted RTK Query cache contains no request state. */
function expectAccountCacheCleared(state: unknown): void {
  if (typeof state !== "object" || state === null || !("accountApi" in state)) {
    throw new Error("Account API reducer is not mounted in the runtime spec.");
  }

  const apiState = state.accountApi;

  if (typeof apiState !== "object" || apiState === null) {
    throw new Error("Account API cache state is unavailable.");
  }

  expect(Reflect.get(apiState, "queries")).toEqual({});
  expect(Reflect.get(apiState, "mutations")).toEqual({});
}
