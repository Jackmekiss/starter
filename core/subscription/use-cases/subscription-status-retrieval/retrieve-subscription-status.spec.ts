import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionGateway } from "@core/subscription/adapters/in-memory/in-memory-subscription-gateway";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { subscriptionBuilder } from "@core/subscription/domain/builders/subscription-builder";
import { createStore } from "@core/init-redux-store";

import type { Subscription } from "@core/subscription/domain/subscription";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by status retrieval behavior specs.
 */
function createSubscriptionApi(
  subscriptionGateway: InMemorySubscriptionGateway,
) {
  return createApi(createSubscriptionApiOptions(subscriptionGateway));
}

describe("Subscription Status Retrieval", () => {
  let store: ReduxStore;
  let subscriptionGateway: InMemorySubscriptionGateway;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionGateway = new InMemorySubscriptionGateway();
    subscriptionApi = createSubscriptionApi(subscriptionGateway);
    store = createStore({ subscriptionApi }, {});
  });

  it("should retrieve subscription status", async () => {
    const subscription = subscriptionBuilder()
      .withPlan("monthly")
      .withCurrentPeriodEnd("2027-07-17T00:00:00.000Z")
      .build();

    subscriptionGateway.subscription = subscription;

    await retrieveSubscriptionStatus();

    expectSubscription(subscription);
  });

  /**
   * Dispatches the subscription status retrieval use-case.
   */
  async function retrieveSubscriptionStatus() {
    await store
      .dispatch(subscriptionApi.endpoints.retrieveSubscriptionStatus.initiate())
      .unwrap();
  }

  /**
   * Expects retrieved subscription status to be stored in subscription state.
   */
  function expectSubscription(subscriptionExpected: Subscription) {
    expect(store.getState().subscription.subscription).toEqual(
      subscriptionExpected,
    );
  }
});
