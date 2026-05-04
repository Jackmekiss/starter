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
  price?: {
    amount: number;
    currency: "EUR";
  };
  currentPeriodEnd?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
}
