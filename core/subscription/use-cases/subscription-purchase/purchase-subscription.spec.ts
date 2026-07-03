import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionBaseQuery } from "@core/subscription/adapters/in-memory/in-memory-subscription-base-query";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { createStore } from "@core/init-redux-store";

import type { PurchaseSubscriptionPayload } from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by purchase behavior specs.
 */
function createSubscriptionApi(
  subscriptionBaseQuery: InMemorySubscriptionBaseQuery,
) {
  return createApi(
    createSubscriptionApiOptions(subscriptionBaseQuery.handle()),
  );
}

describe("Subscription Purchase", () => {
  let store: ReduxStore;
  let subscriptionBaseQuery: InMemorySubscriptionBaseQuery;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionBaseQuery = new InMemorySubscriptionBaseQuery();
    subscriptionApi = createSubscriptionApi(subscriptionBaseQuery);
    store = createStore({ subscriptionApi }, {});
  });

  it("should purchase subscription", async () => {
    const result = await purchaseSubscription({
      plan: "monthly",
    });

    if (!result.success) {
      throw new Error("Expected subscription purchase to succeed.");
    }

    expect(result.plan).toBe("monthly");
    expect(result.subscription).toMatchObject({
      cancelAtPeriodEnd: false,
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
    expect(store.getState().subscription.errorMessage).toBeNull();
  }
});
