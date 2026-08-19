import { setSubscription } from "@core/subscription/domain/slice";

import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { SubscriptionBaseQueryFn } from "@core/subscription/gateways/subscription-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that purchases a selected premium plan.
 */
export function purchaseSubscriptionBuilder(
  build: EndpointBuilder<SubscriptionBaseQueryFn, never, "subscriptionApi">,
) {
  return {
    purchaseSubscription: build.mutation<
      SubscriptionActionResult,
      PurchaseSubscriptionPayload
    >({
      query: (body) => ({
        url: "/purchase",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSubscription(data.subscription));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
