import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { openSubscriptionManagementBuilder } from "../use-cases/subscription-management/openSubscriptionManagement";
import { retrieveSubscriptionOfferingsBuilder } from "../use-cases/subscription-offerings-retrieval/retrieveSubscriptionOfferings";
import { purchaseSubscriptionBuilder } from "../use-cases/subscription-purchase/purchaseSubscription";
import { restoreSubscriptionPurchasesBuilder } from "../use-cases/subscription-restore/restoreSubscriptionPurchases";
import { retrieveSubscriptionStatusBuilder } from "../use-cases/subscription-status-retrieval/retrieveSubscriptionStatus";

export const createSubscriptionAPI = (baseQuery: BaseQueryFn) =>
  createApi({
    baseQuery,
    reducerPath: "subscriptionAPI",
    endpoints: (builder) => ({
      ...retrieveSubscriptionOfferingsBuilder(builder),
      ...purchaseSubscriptionBuilder(builder),
      ...restoreSubscriptionPurchasesBuilder(builder),
      ...openSubscriptionManagementBuilder(builder),
      ...retrieveSubscriptionStatusBuilder(builder),
    }),
  });
