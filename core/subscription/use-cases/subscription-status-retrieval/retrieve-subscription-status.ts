import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { Subscription } from "../../domain/subscription";
import { setSubscription } from "../../domain/slice";

/** Builds the endpoint that retrieves the current premium entitlement. */
export function retrieveSubscriptionStatusBuilder(
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionApi">,
) {
  return {
    retrieveSubscriptionStatus: build.query<Subscription | null, void>({
      query: () => ({
        url: "/status/retrieve",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(setSubscription(data));
      },
    }),
  };
}
