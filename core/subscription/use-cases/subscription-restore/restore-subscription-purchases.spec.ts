import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionBaseQuery } from "@core/subscription/adapters/in-memory/in-memory-subscription-base-query";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { subscriptionBuilder } from "@core/subscription/domain/builders/subscription-builder";
import { createStore } from "@core/init-redux-store";

import type { Subscription } from "@core/subscription/domain/subscription";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by restore behavior specs.
 */
function createSubscriptionApi(
  subscriptionBaseQuery: InMemorySubscriptionBaseQuery,
) {
  return createApi(
    createSubscriptionApiOptions(subscriptionBaseQuery.handle()),
  );
}

describe("Subscription Restore", () => {
  let store: ReduxStore;
  let subscriptionBaseQuery: InMemorySubscriptionBaseQuery;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionBaseQuery = new InMemorySubscriptionBaseQuery();
    subscriptionApi = createSubscriptionApi(subscriptionBaseQuery);
    store = createStore({ subscriptionApi }, {});
  });

  it("should restore subscription purchases", async () => {
    const subscription = subscriptionBuilder()
      .withPlan("annual")
      .withCurrentPeriodEnd("2027-06-17T00:00:00.000Z")
      .build();

    subscriptionBaseQuery.subscription = subscription;

    await restoreSubscriptionPurchases();

    expectSubscription(subscription);
  });

  it("should reject without changing durable subscription state", async () => {
    subscriptionBaseQuery.subscription = subscriptionBuilder()
      .withTier("free")
      .withStatus("inactive")
      .withoutPlan()
      .withoutPrice()
      .withoutCurrentPeriodEnd()
      .build();

    await expect(restoreSubscriptionPurchases()).rejects.toEqual({
      kind: "not-found",
      code: "NO_ACTIVE_PURCHASE",
      retryable: false,
    });

    expect(store.getState().subscription.subscription).toBeNull();
  });

  /**
   * Dispatches the subscription restore use-case.
   */
  async function restoreSubscriptionPurchases() {
    await store
      .dispatch(
        subscriptionApi.endpoints.restoreSubscriptionPurchases.initiate(),
      )
      .unwrap();
  }

  /**
   * Expects restored subscription to be stored in subscription state.
   */
  function expectSubscription(subscriptionExpected: Subscription) {
    expect(store.getState().subscription.subscription).toEqual(
      subscriptionExpected,
    );
  }
});
