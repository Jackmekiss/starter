import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { SubscriptionActionResult } from "../../apis/types";
import { setSubscription, setSubscriptionError } from "../../domain/slice";

/**
 * Builds the endpoint that restores previous premium purchases.
 */
export function restoreSubscriptionPurchasesBuilder(
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionApi">,
) {
  return {
    restoreSubscriptionPurchases: build.mutation<
      SubscriptionActionResult,
      void
    >({
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
  };
}
