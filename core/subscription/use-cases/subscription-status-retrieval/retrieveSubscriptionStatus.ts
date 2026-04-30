import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { Subscription } from "../../../auth/domain/subscription";
import { setSubscription } from "../../domain/slice";

export const retrieveSubscriptionStatusBuilder = (
  build: EndpointBuilder<BaseQueryFn, never, "subscriptionAPI">,
) => ({
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
});
