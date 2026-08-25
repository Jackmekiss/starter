import { createApi } from "@reduxjs/toolkit/query/react";
import { describe, expect, it } from "vitest";

import { InMemoryAccountGateway } from "@core/account/adapters/in-memory/in-memory-account-gateway";
import { createAccountApiOptions } from "@core/account/apis/account-api";
import { accountBuilder } from "@core/account/domain/builders/account-builder";
import { createStore } from "@core/init-redux-store";

describe("Account retrieval", () => {
  it("retrieves and stores the current account", async () => {
    const gateway = new InMemoryAccountGateway();
    const account = accountBuilder().build();
    gateway.account = account;
    const api = createApi(createAccountApiOptions(gateway));
    const store = createStore({ accountApi: api });

    await expect(
      store.dispatch(api.endpoints.retrieveAccount.initiate()).unwrap(),
    ).resolves.toEqual(account);
    expect(store.getState().account.current).toEqual(account);
  });
});
