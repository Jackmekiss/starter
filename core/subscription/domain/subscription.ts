/**
 * Commercial billing interval available for premium access.
 */
export type SubscriptionPlan = "annual" | "monthly";

/**
 * Product access tier currently granted to the account.
 */
export type SubscriptionTier = "free" | "premium";

/**
 * Provider-normalized lifecycle state for premium entitlement.
 */
export type SubscriptionStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "canceled";

/**
 * Current premium entitlement and renewal metadata for the account.
 */
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
