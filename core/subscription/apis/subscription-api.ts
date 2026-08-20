import { fakeBaseQuery } from "@reduxjs/toolkit/query";

import { openSubscriptionManagementBuilder } from "@core/subscription/use-cases/subscription-management/open-subscription-management";
import { retrieveSubscriptionOfferingsBuilder } from "@core/subscription/use-cases/subscription-offerings-retrieval/retrieve-subscription-offerings";
import { purchaseSubscriptionBuilder } from "@core/subscription/use-cases/subscription-purchase/purchase-subscription";
import { restoreSubscriptionPurchasesBuilder } from "@core/subscription/use-cases/subscription-restore/restore-subscription-purchases";
import { retrieveSubscriptionStatusBuilder } from "@core/subscription/use-cases/subscription-status-retrieval/retrieve-subscription-status";

import type { SubscriptionApiBaseQueryFn } from "@core/subscription/apis/subscription-api-base-query";
import type { SubscriptionError } from "@core/subscription/domain/subscription-error";
import type { SubscriptionGateway } from "@core/subscription/gateways/subscription-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds RTK Query endpoint options for subscription status and purchases.
 */
export function createSubscriptionApiOptions(
  subscriptionGateway: SubscriptionGateway,
) {
  return {
    baseQuery: fakeBaseQuery<SubscriptionError>(),
    reducerPath: "subscriptionApi",
    endpoints: (
      builder: EndpointBuilder<
        SubscriptionApiBaseQueryFn,
        never,
        "subscriptionApi"
      >,
    ) => ({
      ...retrieveSubscriptionOfferingsBuilder(builder, subscriptionGateway),
      ...purchaseSubscriptionBuilder(builder, subscriptionGateway),
      ...restoreSubscriptionPurchasesBuilder(builder, subscriptionGateway),
      ...openSubscriptionManagementBuilder(builder, subscriptionGateway),
      ...retrieveSubscriptionStatusBuilder(builder, subscriptionGateway),
    }),
  };
}
