import { createApi } from "@reduxjs/toolkit/query/react";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAccountGateway } from "@core/account/adapters/in-memory/in-memory-account-gateway";
import { createAccountApiOptions } from "@core/account/apis/account-api";
import { createStore } from "@core/init-redux-store";

describe("Account provisioning", () => {
  let gateway: InMemoryAccountGateway;

  beforeEach(() => {
    gateway = new InMemoryAccountGateway();
  });

  it("provisions idempotently and stores the account", async () => {
    const api = createApi(createAccountApiOptions(gateway));
    const store = createStore({ accountApi: api });

    const first = await store
      .dispatch(api.endpoints.provisionAccount.initiate())
      .unwrap();
    const second = await store
      .dispatch(api.endpoints.provisionAccount.initiate())
      .unwrap();

    expect(second).toEqual(first);
    expect(first.onboardingStatus).toBe("pending");
    expect(store.getState().account.current).toEqual(first);
  });

  it("preserves typed failures without mutating state", async () => {
    gateway.error = { kind: "network", retryable: true };
    const api = createApi(createAccountApiOptions(gateway));
    const store = createStore({ accountApi: api });

    await expect(
      store.dispatch(api.endpoints.provisionAccount.initiate()).unwrap(),
    ).rejects.toEqual({ kind: "network", retryable: true });
    expect(store.getState().account.current).toBeNull();
  });
});
