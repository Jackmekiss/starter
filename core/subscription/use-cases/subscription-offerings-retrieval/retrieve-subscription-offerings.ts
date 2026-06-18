import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { SubscriptionOffering } from "../../domain/subscription-offering";
import { updateSubscriptionOfferings } from "../../domain/slice";

export function retrieveSubscriptionOfferingsBuilder(
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionAPI">,
) {
  return {
    retrieveSubscriptionOfferings: build.query<SubscriptionOffering[], void>({
      query: () => ({
        url: "/offerings/retrieve",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(updateSubscriptionOfferings(data));
      },
    }),
  };
}
