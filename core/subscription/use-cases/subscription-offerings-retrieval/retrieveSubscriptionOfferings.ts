import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { SubscriptionOffering } from "../../domain/subscriptionOffering";
import { updateSubscriptionOfferings } from "../../domain/slice";

export const retrieveSubscriptionOfferingsBuilder = (
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionAPI">,
) => ({
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
});
