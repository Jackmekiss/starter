import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionBaseQuery } from "@core/subscription/adapters/in-memory/in-memory-subscription-base-query";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { subscriptionBuilder } from "@core/subscription/domain/builders/subscription-builder";
import { createStore } from "@core/init-redux-store";

import type { Subscription } from "@core/subscription/domain/subscription";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by status retrieval behavior specs.
 */
function createSubscriptionApi(
  subscriptionBaseQuery: InMemorySubscriptionBaseQuery,
) {
  return createApi(
    createSubscriptionApiOptions(subscriptionBaseQuery.handle()),
  );
}

describe("Subscription Status Retrieval", () => {
  let store: ReduxStore;
  let subscriptionBaseQuery: InMemorySubscriptionBaseQuery;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionBaseQuery = new InMemorySubscriptionBaseQuery();
    subscriptionApi = createSubscriptionApi(subscriptionBaseQuery);
    store = createStore({ subscriptionApi }, {});
  });

  it("should retrieve subscription status", async () => {
    const subscription = subscriptionBuilder()
      .withPlan("monthly")
      .withCurrentPeriodEnd("2027-07-17T00:00:00.000Z")
      .build();

    subscriptionBaseQuery.subscription = subscription;

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
