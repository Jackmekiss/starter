import { setSubscription } from "@core/subscription/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { SubscriptionApiBaseQueryFn } from "@core/subscription/apis/subscription-api-base-query";
import type { SubscriptionActionResult } from "@core/subscription/apis/types";
import type { SubscriptionGateway } from "@core/subscription/gateways/subscription-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds the endpoint that restores previous premium purchases.
 */
export function restoreSubscriptionPurchasesBuilder(
  build: EndpointBuilder<SubscriptionApiBaseQueryFn, never, "subscriptionApi">,
  subscriptionGateway: SubscriptionGateway,
) {
  return {
    restoreSubscriptionPurchases: build.mutation<
      SubscriptionActionResult,
      void
    >({
      queryFn: async () =>
        toRtkQueryResult(
          await subscriptionGateway.restoreSubscriptionPurchases(),
        ),
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
