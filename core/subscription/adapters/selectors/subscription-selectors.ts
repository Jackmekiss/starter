import { createSelector } from "@reduxjs/toolkit";

import { subscriptionOfferingAdapter } from "@core/subscription/domain/slice";

import type { RootState } from "@core/init-redux-store";
import type { Subscription } from "@core/subscription/domain/subscription";

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
