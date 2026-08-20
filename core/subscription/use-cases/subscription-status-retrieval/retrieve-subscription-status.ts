import { setSubscription } from "@core/subscription/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { SubscriptionApiBaseQueryFn } from "@core/subscription/apis/subscription-api-base-query";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionGateway } from "@core/subscription/gateways/subscription-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that retrieves the current premium entitlement.
 */
export function retrieveSubscriptionStatusBuilder(
  build: EndpointBuilder<SubscriptionApiBaseQueryFn, never, "subscriptionApi">,
  subscriptionGateway: SubscriptionGateway,
) {
  return {
    retrieveSubscriptionStatus: build.query<Subscription | null, void>({
      queryFn: async () =>
        toRtkQueryResult(
          await subscriptionGateway.retrieveSubscriptionStatus(),
        ),
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
