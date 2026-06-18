import { updateSubscriptionOfferings } from "@core/subscription/domain/slice";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";

/**
 * Builds the endpoint that retrieves available premium offerings.
 */
export function retrieveSubscriptionOfferingsBuilder(
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionApi">,
) {
  return {
    retrieveSubscriptionOfferings: build.query<SubscriptionOffering[], void>({
      query: () => ({
        url: "/offerings/retrieve",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(updateSubscriptionOfferings(data));
      },
    }),
  };
}
