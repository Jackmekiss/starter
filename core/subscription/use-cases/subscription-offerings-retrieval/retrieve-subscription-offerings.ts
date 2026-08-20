import { updateSubscriptionOfferings } from "@core/subscription/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { SubscriptionApiBaseQueryFn } from "@core/subscription/apis/subscription-api-base-query";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionGateway } from "@core/subscription/gateways/subscription-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that retrieves available premium offerings.
 */
export function retrieveSubscriptionOfferingsBuilder(
  build: EndpointBuilder<SubscriptionApiBaseQueryFn, never, "subscriptionApi">,
  subscriptionGateway: SubscriptionGateway,
) {
  return {
    retrieveSubscriptionOfferings: build.query<SubscriptionOffering[], void>({
      queryFn: async () =>
        toRtkQueryResult(
          await subscriptionGateway.retrieveSubscriptionOfferings(),
        ),
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
