import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "../../apis/types";
import { setSubscription, setSubscriptionError } from "../../domain/slice";

/** Builds the endpoint that purchases a selected premium plan. */
export function purchaseSubscriptionBuilder(
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionApi">,
) {
  return {
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
  };
}
