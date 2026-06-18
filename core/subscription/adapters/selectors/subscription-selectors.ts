import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../init-redux-store";
import { subscriptionOfferingAdapter } from "../../domain/slice";
import type { Subscription } from "../../domain/subscription";

export const subscriptionOfferingSelectors =
  subscriptionOfferingAdapter.getSelectors(
    (state: RootState) => state.subscriptionOfferings,
  );

/**
 * Returns the current subscription entitlement, if one is known.
 */
export function selectCurrentSubscription(
  state: RootState,
): Subscription | null {
  return state.subscription.subscription;
}

/**
 * Returns the latest subscription action error message for UI display.
 */
export function selectSubscriptionErrorMessage(
  state: RootState,
): string | null {
  return state.subscription.errorMessage;
}

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
