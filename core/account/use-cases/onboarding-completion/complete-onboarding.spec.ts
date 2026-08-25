import { createApi } from "@reduxjs/toolkit/query/react";
import { describe, expect, it } from "vitest";

import { InMemoryAccountGateway } from "@core/account/adapters/in-memory/in-memory-account-gateway";
import { createAccountApiOptions } from "@core/account/apis/account-api";
import { accountBuilder } from "@core/account/domain/builders/account-builder";
import { createStore } from "@core/init-redux-store";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

describe("Account onboarding completion", () => {
  it("completes once and stores the returned Account", async () => {
    const dates = new DeterministicDateProvider();
    dates.dateOfNow = new Date("2026-02-03T04:05:06.000Z");
    const gateway = new InMemoryAccountGateway(dates);
    gateway.account = accountBuilder().withOnboardingStatus("pending").build();
    const api = createApi(createAccountApiOptions(gateway));
    const store = createStore({ accountApi: api });

    const completed = await store
      .dispatch(api.endpoints.completeOnboarding.initiate())
      .unwrap();

    dates.dateOfNow = new Date("2026-02-04T04:05:06.000Z");

    const repeated = await store
      .dispatch(api.endpoints.completeOnboarding.initiate())
      .unwrap();

    expect(completed).toMatchObject({
      onboardingStatus: "completed",
      updatedAt: "2026-02-03T04:05:06.000Z",
    });
    expect(repeated).toEqual(completed);
    expect(store.getState().account.current).toEqual(completed);
  });
});
