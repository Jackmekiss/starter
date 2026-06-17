import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { openSubscriptionManagementBuilder } from "../use-cases/subscription-management/openSubscriptionManagement";
import { retrieveSubscriptionOfferingsBuilder } from "../use-cases/subscription-offerings-retrieval/retrieveSubscriptionOfferings";
import { purchaseSubscriptionBuilder } from "../use-cases/subscription-purchase/purchaseSubscription";
import { restoreSubscriptionPurchasesBuilder } from "../use-cases/subscription-restore/restoreSubscriptionPurchases";
import { retrieveSubscriptionStatusBuilder } from "../use-cases/subscription-status-retrieval/retrieveSubscriptionStatus";

export const createSubscriptionAPIOptions = (baseQuery: BaseQueryFn) => ({
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
});
