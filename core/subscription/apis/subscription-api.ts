import { openSubscriptionManagementBuilder } from "@core/subscription/use-cases/subscription-management/open-subscription-management";
import { retrieveSubscriptionOfferingsBuilder } from "@core/subscription/use-cases/subscription-offerings-retrieval/retrieve-subscription-offerings";
import { purchaseSubscriptionBuilder } from "@core/subscription/use-cases/subscription-purchase/purchase-subscription";
import { restoreSubscriptionPurchasesBuilder } from "@core/subscription/use-cases/subscription-restore/restore-subscription-purchases";
import { retrieveSubscriptionStatusBuilder } from "@core/subscription/use-cases/subscription-status-retrieval/retrieve-subscription-status";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds RTK Query endpoint options for subscription status and purchases.
 */
export function createSubscriptionApiOptions(baseQuery: BaseQueryFn) {
  return {
    baseQuery,
    reducerPath: "subscriptionApi",
    endpoints: (
      builder: EndpointBuilder<BaseQueryFn, never, "subscriptionApi">,
    ) => ({
      ...retrieveSubscriptionOfferingsBuilder(builder),
      ...purchaseSubscriptionBuilder(builder),
      ...restoreSubscriptionPurchasesBuilder(builder),
      ...openSubscriptionManagementBuilder(builder),
      ...retrieveSubscriptionStatusBuilder(builder),
    }),
  };
}
