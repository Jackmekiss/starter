import { createListenerMiddleware } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import { appMode } from "@/app-runtime/runtime/app-mode";
import { clearAuth } from "@core/auth/domain/slice";
import { FakeSubscriptionGateway } from "@core/subscription/adapters/fake/fake-subscription-gateway";
import { InMemorySubscriptionGateway } from "@core/subscription/adapters/in-memory/in-memory-subscription-gateway";
import { createSubscriptionApiOptions } from "@core/subscription/apis/subscription-api";
import { clearSubscriptionState } from "@core/subscription/domain/slice";
import { RealDateProvider } from "@core/shared/adapters/date/real-date-provider";

import type { SubscriptionGateway } from "@core/subscription/gateways/subscription-gateway";

/** Creates the subscription gateway implementation for the current runtime mode. */
function createSubscriptionGateway(): SubscriptionGateway {
  const dateProvider = new RealDateProvider();

  if (appMode === "fake") {
    return new FakeSubscriptionGateway(dateProvider);
  }

  return new InMemorySubscriptionGateway(dateProvider);
}

export const subscriptionApi = createApi(
  createSubscriptionApiOptions(createSubscriptionGateway()),
);

export const subscriptionSessionListenerMiddleware = createListenerMiddleware();

subscriptionSessionListenerMiddleware.startListening({
  actionCreator: clearAuth,
  effect: (_, { dispatch }) => {
    dispatch(clearSubscriptionState());
    dispatch(subscriptionApi.util.resetApiState());
  },
});

export const {
  useOpenSubscriptionManagementMutation,
  usePurchaseSubscriptionMutation,
  useRestoreSubscriptionPurchasesMutation,
  useRetrieveSubscriptionOfferingsQuery,
  useRetrieveSubscriptionStatusQuery,
} = subscriptionApi;
