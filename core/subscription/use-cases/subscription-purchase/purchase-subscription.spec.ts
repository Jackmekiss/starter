import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionGateway } from "@core/subscription/adapters/in-memory/in-memory-subscription-gateway";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { createStore } from "@core/init-redux-store";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

import type { PurchaseSubscriptionPayload } from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by purchase behavior specs.
 */
function createSubscriptionApi(
  subscriptionGateway: InMemorySubscriptionGateway,
) {
  return createApi(createSubscriptionApiOptions(subscriptionGateway));
}

describe("Subscription Purchase", () => {
  let store: ReduxStore;
  let subscriptionGateway: InMemorySubscriptionGateway;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    const dateProvider = new DeterministicDateProvider();
    dateProvider.dateOfNow = new Date("2026-06-17T00:00:00.000Z");
    subscriptionGateway = new InMemorySubscriptionGateway(dateProvider);
    subscriptionApi = createSubscriptionApi(subscriptionGateway);
    store = createStore({ subscriptionApi }, {});
  });

  it("should purchase subscription", async () => {
    const result = await purchaseSubscription({
      plan: "monthly",
    });

    expect(result.plan).toBe("monthly");
    expect(result.subscription).toMatchObject({
      cancelAtPeriodEnd: false,
      currentPeriodEnd: "2026-07-17T00:00:00.000Z",
      plan: "monthly",
      status: "active",
      tier: "premium",
    });
    expectSubscription(result.subscription);
  });

  /**
   * Dispatches the subscription purchase use-case.
   */
  async function purchaseSubscription(payload: PurchaseSubscriptionPayload) {
    return store
      .dispatch(
        subscriptionApi.endpoints.purchaseSubscription.initiate(payload),
      )
      .unwrap();
  }

  /**
   * Expects purchased subscription to be stored in subscription state.
   */
  function expectSubscription(subscriptionExpected: Subscription) {
    expect(store.getState().subscription.subscription).toEqual(
      subscriptionExpected,
    );
  }
});
