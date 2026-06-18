import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "../../apis/types";
import { setSubscription, setSubscriptionError } from "../../domain/slice";

export const purchaseSubscriptionBuilder = (
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionAPI">,
) => ({
  purchaseSubscription: build.mutation<
    SubscriptionActionResult,
    PurchaseSubscriptionPayload
  >({
    query: (body) => ({
      url: "/purchase",
      method: "POST",
      body,
    }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      const { data } = await queryFulfilled;

      if (data.success) {
        dispatch(setSubscription(data.subscription));
      } else {
        dispatch(setSubscriptionError(data.errorMessage));
      }
    },
  }),
});
