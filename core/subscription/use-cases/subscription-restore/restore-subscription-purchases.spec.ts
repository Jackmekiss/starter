import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionGateway } from "@core/subscription/adapters/in-memory/in-memory-subscription-gateway";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { subscriptionBuilder } from "@core/subscription/domain/builders/subscription-builder";
import { createStore } from "@core/init-redux-store";

import type { Subscription } from "@core/subscription/domain/subscription";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by restore behavior specs.
 */
function createSubscriptionApi(
  subscriptionGateway: InMemorySubscriptionGateway,
) {
  return createApi(createSubscriptionApiOptions(subscriptionGateway));
}

describe("Subscription Restore", () => {
  let store: ReduxStore;
  let subscriptionGateway: InMemorySubscriptionGateway;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionGateway = new InMemorySubscriptionGateway();
    subscriptionApi = createSubscriptionApi(subscriptionGateway);
    store = createStore({ subscriptionApi }, {});
  });

  it("should restore subscription purchases", async () => {
    const subscription = subscriptionBuilder()
      .withPlan("annual")
      .withCurrentPeriodEnd("2027-06-17T00:00:00.000Z")
      .build();

    subscriptionGateway.subscription = subscription;

    await restoreSubscriptionPurchases();

    expectSubscription(subscription);
  });

  it("should reject without changing durable subscription state", async () => {
    subscriptionGateway.subscription = subscriptionBuilder()
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
