import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemorySubscriptionGateway } from "@core/subscription/adapters/in-memory/in-memory-subscription-gateway";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { subscriptionOfferingBuilder } from "@core/subscription/domain/builders/subscription-offering-builder";
import { createStore } from "@core/init-redux-store";

import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the subscription API used by offering retrieval behavior specs.
 */
function createSubscriptionApi(
  subscriptionGateway: InMemorySubscriptionGateway,
) {
  return createApi(createSubscriptionApiOptions(subscriptionGateway));
}

describe("Subscription Offerings Retrieval", () => {
  let store: ReduxStore;
  let subscriptionGateway: InMemorySubscriptionGateway;
  let subscriptionApi: ReturnType<typeof createSubscriptionApi>;

  beforeEach(() => {
    subscriptionGateway = new InMemorySubscriptionGateway();
    subscriptionApi = createSubscriptionApi(subscriptionGateway);
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

    subscriptionGateway.subscriptionOfferings = offerings;

    await retrieveSubscriptionOfferings();

    expectSubscriptionOfferings(offerings);
  });

  it("should expose a technical failure without storing offerings", async () => {
    subscriptionGateway.error = { kind: "network", retryable: true };

    await expect(retrieveSubscriptionOfferings()).rejects.toEqual({
      kind: "network",
      retryable: true,
    });

    expect(store.getState().subscriptionOfferings.ids).toEqual([]);
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
