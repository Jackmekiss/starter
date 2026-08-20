import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionGateway } from "@core/subscription/adapters/in-memory/in-memory-subscription-gateway";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { subscriptionBuilder } from "@core/subscription/domain/builders/subscription-builder";
import { createStore } from "@core/init-redux-store";

import type { Subscription } from "@core/subscription/domain/subscription";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by subscription management behavior specs.
 */
function createSubscriptionApi(
  subscriptionGateway: InMemorySubscriptionGateway,
) {
  return createApi(createSubscriptionApiOptions(subscriptionGateway));
}

describe("Subscription Management", () => {
  let store: ReduxStore;
  let subscriptionGateway: InMemorySubscriptionGateway;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionGateway = new InMemorySubscriptionGateway();
    subscriptionApi = createSubscriptionApi(subscriptionGateway);
    store = createStore({ subscriptionApi }, {});
  });

  it("should open subscription management", async () => {
    const subscription = subscriptionBuilder()
      .withPlan("annual")
      .withCancelAtPeriodEnd(true)
      .build();

    subscriptionGateway.subscription = subscription;

    await openSubscriptionManagement();

    expectSubscription(subscription);
  });

  /**
   * Dispatches the subscription management use-case.
   */
  async function openSubscriptionManagement() {
    await store
      .dispatch(subscriptionApi.endpoints.openSubscriptionManagement.initiate())
      .unwrap();
  }

  /**
   * Expects managed subscription to be stored in subscription state.
   */
  function expectSubscription(subscriptionExpected: Subscription) {
    expect(store.getState().subscription.subscription).toEqual(
      subscriptionExpected,
    );
  }
});
