import {
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import type { Subscription } from "./subscription";
import type { SubscriptionOffering } from "./subscription-offering";

export const subscriptionOfferingAdapter =
  createEntityAdapter<SubscriptionOffering>();

/** Durable subscription state used to gate premium behavior and errors. */
export interface SubscriptionState {
  subscription: Subscription | null;
  errorMessage: string | null;
}

const initialSubscriptionState: SubscriptionState = {
  subscription: null,
  errorMessage: null,
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
      errorMessage: null,
    }),
    setSubscriptionError: (state, action) => ({
      ...state,
      errorMessage: action.payload,
    }),
    clearSubscription: (state) => ({
      ...state,
      subscription: null,
      errorMessage: null,
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

export const { setSubscription, setSubscriptionError, clearSubscription } =
  subscriptionSlice.actions;

export const { updateSubscriptionOfferings } =
  subscriptionOfferingSlice.actions;
