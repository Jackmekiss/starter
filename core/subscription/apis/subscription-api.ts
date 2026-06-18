import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { openSubscriptionManagementBuilder } from "../use-cases/subscription-management/open-subscription-management";
import { retrieveSubscriptionOfferingsBuilder } from "../use-cases/subscription-offerings-retrieval/retrieve-subscription-offerings";
import { purchaseSubscriptionBuilder } from "../use-cases/subscription-purchase/purchase-subscription";
import { restoreSubscriptionPurchasesBuilder } from "../use-cases/subscription-restore/restore-subscription-purchases";
import { retrieveSubscriptionStatusBuilder } from "../use-cases/subscription-status-retrieval/retrieve-subscription-status";

/** Builds RTK Query endpoint options for subscription status and purchases. */
export function createSubscriptionAPIOptions(baseQuery: BaseQueryFn) {
  return {
    baseQuery,
    reducerPath: "subscriptionAPI",
    endpoints: (
      builder: EndpointBuilder<BaseQueryFn, never, "subscriptionAPI">,
    ) => ({
      ...retrieveSubscriptionOfferingsBuilder(builder),
      ...purchaseSubscriptionBuilder(builder),
      ...restoreSubscriptionPurchasesBuilder(builder),
      ...openSubscriptionManagementBuilder(builder),
      ...retrieveSubscriptionStatusBuilder(builder),
    }),
  };
}
