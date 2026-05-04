export type SubscriptionPlan = "annual" | "monthly";

export type SubscriptionTier = "free" | "premium";

export type SubscriptionStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "canceled";

export interface Subscription {
  tier: SubscriptionTier;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export const createDefaultSubscription = (): Subscription => ({
  tier: "free",
  status: "inactive",
  cancelAtPeriodEnd: false,
});
