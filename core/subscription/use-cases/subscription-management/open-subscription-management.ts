import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { SubscriptionActionResult } from "../../apis/types";
import { setSubscription, setSubscriptionError } from "../../domain/slice";

/**
 * Builds the endpoint that opens or refreshes subscription management state.
 */
export function openSubscriptionManagementBuilder(
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionApi">,
) {
  return {
    openSubscriptionManagement: build.mutation<SubscriptionActionResult, void>({
      query: () => ({
        url: "/manage",
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
