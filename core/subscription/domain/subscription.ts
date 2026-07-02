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
  /**
   * Access level currently granted to the account.
   */
  tier: SubscriptionTier;

  /**
   * Premium plan tied to the entitlement when one is active.
   */
  plan?: SubscriptionPlan;

  /**
   * Provider-normalized lifecycle state for the entitlement.
   */
  status: SubscriptionStatus;

  /**
   * Optional recurring price metadata returned by the billing provider.
   */
  price?: {
    /**
     * Numeric price amount in the smallest displayed currency unit.
     */
    amount: number;

    /**
     * Currency used by the current premium offering.
     */
    currency: "EUR";
  };

  /**
   * ISO timestamp for the end of the current paid billing period.
   */
  currentPeriodEnd?: string;

  /**
   * ISO timestamp for the end of the active trial period.
   */
  trialEnd?: string;

  /**
   * Whether renewal is disabled at the end of the current period.
   */
  cancelAtPeriodEnd: boolean;
}
