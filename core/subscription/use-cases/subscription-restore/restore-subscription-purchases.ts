import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { SubscriptionActionResult } from "../../apis/types";
import { setSubscription, setSubscriptionError } from "../../domain/slice";

export const restoreSubscriptionPurchasesBuilder = (
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionAPI">,
) => ({
  restoreSubscriptionPurchases: build.mutation<SubscriptionActionResult, void>({
    query: () => ({
      url: "/restore",
      method: "POST",
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
