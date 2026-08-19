import { updateSubscriptionOfferings } from "@core/subscription/domain/slice";

import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionBaseQueryFn } from "@core/subscription/gateways/subscription-base-query";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that retrieves available premium offerings.
 */
export function retrieveSubscriptionOfferingsBuilder(
  build: EndpointBuilder<SubscriptionBaseQueryFn, never, "subscriptionApi">,
) {
  return {
    retrieveSubscriptionOfferings: build.query<SubscriptionOffering[], void>({
      query: () => ({
        url: "/offerings/retrieve",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateSubscriptionOfferings(data));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
