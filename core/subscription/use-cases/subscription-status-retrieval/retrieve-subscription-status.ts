import { setSubscription } from "@core/subscription/domain/slice";

import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionBaseQueryFn } from "@core/subscription/gateways/subscription-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that retrieves the current premium entitlement.
 */
export function retrieveSubscriptionStatusBuilder(
  build: EndpointBuilder<SubscriptionBaseQueryFn, never, "subscriptionApi">,
) {
  return {
    retrieveSubscriptionStatus: build.query<Subscription | null, void>({
      query: () => ({
        url: "/status/retrieve",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSubscription(data));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
