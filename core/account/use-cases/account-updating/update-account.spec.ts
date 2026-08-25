import { createApi } from "@reduxjs/toolkit/query/react";
import { describe, expect, it } from "vitest";

import { InMemoryAccountGateway } from "@core/account/adapters/in-memory/in-memory-account-gateway";
import { createAccountApiOptions } from "@core/account/apis/account-api";
import { accountBuilder } from "@core/account/domain/builders/account-builder";
import { createStore } from "@core/init-redux-store";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

describe("Account updating", () => {
  it("normalizes, timestamps, and stores the display name", async () => {
    const dates = new DeterministicDateProvider();
    dates.dateOfNow = new Date("2026-02-03T04:05:06.000Z");
    const gateway = new InMemoryAccountGateway(dates);
    gateway.account = accountBuilder().build();
    const api = createApi(createAccountApiOptions(gateway));
    const store = createStore({ accountApi: api });

    const account = await store
      .dispatch(
        api.endpoints.updateAccount.initiate({ displayName: "  Ada  " }),
      )
      .unwrap();

    expect(account.displayName).toBe("Ada");
    expect(account.updatedAt).toBe("2026-02-03T04:05:06.000Z");
    expect(store.getState().account.current).toEqual(account);
  });

  it("normalizes an empty display name to null", async () => {
    const gateway = new InMemoryAccountGateway();
    gateway.account = accountBuilder({ displayName: "Ada" }).build();
    const api = createApi(createAccountApiOptions(gateway));
    const store = createStore({ accountApi: api });

    const account = await store
      .dispatch(api.endpoints.updateAccount.initiate({ displayName: "   " }))
      .unwrap();

    expect(account.displayName).toBeNull();
  });
});
