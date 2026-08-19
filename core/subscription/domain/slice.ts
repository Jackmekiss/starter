import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import type { EntityState } from "@reduxjs/toolkit";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";

export const subscriptionOfferingAdapter =
  createEntityAdapter<SubscriptionOffering>();

/**
 * Durable subscription state used to gate premium behavior.
 */
export interface SubscriptionState {
  /**
   * Current premium entitlement known by the app.
   */
  subscription: Subscription | null;
}

const initialSubscriptionState: SubscriptionState = {
  subscription: null,
};

const initialSubscriptionOfferingState: EntityState<
  SubscriptionOffering,
  string
> = subscriptionOfferingAdapter.getInitialState();

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: initialSubscriptionState,
  reducers: {
    setSubscription: (state, action) => ({
      ...state,
      subscription: action.payload,
    }),
    clearSubscription: (state) => ({
      ...state,
      subscription: null,
    }),
  },
});

export const subscriptionOfferingSlice = createSlice({
  name: "subscriptionOfferings",
  initialState: initialSubscriptionOfferingState,
  reducers: {
    updateSubscriptionOfferings: subscriptionOfferingAdapter.upsertMany,
  },
});

export const { setSubscription, clearSubscription } = subscriptionSlice.actions;

export const { updateSubscriptionOfferings } =
  subscriptionOfferingSlice.actions;
