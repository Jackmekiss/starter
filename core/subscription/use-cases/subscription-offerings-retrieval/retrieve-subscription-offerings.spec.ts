import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionBaseQuery } from "@core/subscription/adapters/in-memory/in-memory-subscription-base-query";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { subscriptionOfferingBuilder } from "@core/subscription/domain/builders/subscription-offering-builder";
import { createStore } from "@core/init-redux-store";

import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by offering retrieval behavior specs.
 */
function createSubscriptionApi(
  subscriptionBaseQuery: InMemorySubscriptionBaseQuery,
) {
  return createApi(
    createSubscriptionApiOptions(subscriptionBaseQuery.handle()),
  );
}

describe("Subscription Offerings Retrieval", () => {
  let store: ReduxStore;
  let subscriptionBaseQuery: InMemorySubscriptionBaseQuery;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionBaseQuery = new InMemorySubscriptionBaseQuery();
    subscriptionApi = createSubscriptionApi(subscriptionBaseQuery);
    store = createStore({ subscriptionApi }, {});
  });

  it("should retrieve subscription offerings", async () => {
    const offerings = [
      subscriptionOfferingBuilder().withId("annual-offering").build(),
      subscriptionOfferingBuilder()
        .withId("monthly-offering")
        .withPlan("monthly")
        .withTitle("Monthly Premium")
        .withPriceLabel("$7.99")
        .withPeriodLabel("month")
        .build(),
    ];

    subscriptionBaseQuery.subscriptionOfferings = offerings;

    await retrieveSubscriptionOfferings();

    expectSubscriptionOfferings(offerings);
  });

  /**
   * Dispatches the subscription offerings retrieval use-case.
   */
  async function retrieveSubscriptionOfferings() {
    await store
      .dispatch(
        subscriptionApi.endpoints.retrieveSubscriptionOfferings.initiate(),
      )
      .unwrap();
  }

  /**
   * Expects retrieved offerings to be stored in subscription offering state.
   */
  function expectSubscriptionOfferings(
    subscriptionOfferingsExpected: SubscriptionOffering[],
  ) {
    expect(store.getState().subscriptionOfferings.ids).toEqual([
      "annual-offering",
      "monthly-offering",
    ]);
    expect(store.getState().subscriptionOfferings.entities).toEqual({
      "annual-offering": subscriptionOfferingsExpected[0],
      "monthly-offering": subscriptionOfferingsExpected[1],
    });
  }
});
