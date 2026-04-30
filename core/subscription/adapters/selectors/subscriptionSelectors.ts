import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../initReduxStore";
import { subscriptionOfferingAdapter } from "../../domain/slice";

export const subscriptionOfferingSelectors =
  subscriptionOfferingAdapter.getSelectors(
    (state: RootState) => state.subscriptionOfferings,
  );

export const selectCurrentSubscription = (state: RootState) =>
  state.subscription.subscription;

export const selectSubscriptionErrorMessage = (state: RootState) =>
  state.subscription.errorMessage;

export const selectSubscriptionOfferings =
  subscriptionOfferingSelectors.selectAll;

export const selectIsPremium = createSelector(
  [selectCurrentSubscription],
  (subscription) =>
    subscription?.tier === "premium" &&
    ["active", "trialing"].includes(subscription.status),
);

export const selectCanManageSubscription = createSelector(
  [selectCurrentSubscription],
  (subscription) => subscription?.tier === "premium",
);
