import { setSubscription } from "@core/subscription/domain/slice";

import type { SubscriptionActionResult } from "@core/subscription/apis/types";
import type { SubscriptionBaseQueryFn } from "@core/subscription/gateways/subscription-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that restores previous premium purchases.
 */
export function restoreSubscriptionPurchasesBuilder(
  build: EndpointBuilder<SubscriptionBaseQueryFn, never, "subscriptionApi">,
) {
  return {
    restoreSubscriptionPurchases: build.mutation<
      SubscriptionActionResult,
      void
    >({
      query: () => ({
        url: "/restore",
        method: "POST",
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
