import {
  createAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

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

/** Clears every durable state owned by the subscription bounded context. */
export const clearSubscriptionState = createAction(
  "subscription/clearSubscriptionState",
);

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
  extraReducers: (builder) => {
    builder.addCase(clearSubscriptionState, () => initialSubscriptionState);
  },
});

export const subscriptionOfferingSlice = createSlice({
  name: "subscriptionOfferings",
  initialState: initialSubscriptionOfferingState,
  reducers: {
    clearSubscriptionOfferings: subscriptionOfferingAdapter.removeAll,
    updateSubscriptionOfferings: subscriptionOfferingAdapter.upsertMany,
  },
  extraReducers: (builder) => {
    builder.addCase(
      clearSubscriptionState,
      subscriptionOfferingAdapter.removeAll,
    );
  },
});

export const { setSubscription, clearSubscription } = subscriptionSlice.actions;

export const { clearSubscriptionOfferings, updateSubscriptionOfferings } =
  subscriptionOfferingSlice.actions;
