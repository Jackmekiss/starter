import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { Subscription } from "../../auth/domain/subscription";
import { SubscriptionOffering } from "./subscriptionOffering";

export const subscriptionOfferingAdapter =
  createEntityAdapter<SubscriptionOffering>();

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
