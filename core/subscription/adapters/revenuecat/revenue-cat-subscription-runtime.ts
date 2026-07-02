import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionPlan } from "@core/subscription/domain/subscription-plan";

/**
 * Runtime bridge that isolates RevenueCat SDK details from subscription use-cases.
 */
export interface RevenueCatSubscriptionRuntime {
  /**
   * Indicates whether the native RevenueCat SDK can process billing requests.
   */
  isConfigured(): boolean;

  /**
   * Initializes the native RevenueCat SDK for the optional app user identity.
   */
  configure(appUserId?: string): Promise<void>;

  /**
   * Aligns RevenueCat identity with the current authenticated app user.
   */
  syncIdentity(appUserId?: string): Promise<void>;

  /**
   * Retrieves purchasable offerings already mapped into domain paywall models.
   */
  retrieveOfferings(): Promise<SubscriptionOffering[]>;

  /**
   * Purchases the requested plan and returns the resulting premium subscription.
   */
  purchasePlan(plan: SubscriptionPlan): Promise<{
    /**
     * Plan confirmed by RevenueCat for the completed purchase.
     */
    plan: SubscriptionPlan;

    /**
     * Subscription entitlement granted by the completed purchase.
     */
    subscription: Subscription;
  }>;

  /**
   * Restores previous platform purchases into the current domain subscription.
   */
  restorePurchases(): Promise<Subscription | null>;

  /**
   * Reads the latest subscription state from RevenueCat entitlements.
   */
  retrieveSubscriptionStatus(): Promise<Subscription | null>;

  /**
   * Opens the platform-native screen where users manage their subscription.
   */
  openManageSubscriptions(): Promise<void>;

  /**
   * Subscribes to native entitlement updates and returns an unsubscribe callback.
   */
  addSubscriptionStatusListener(
    listener: (subscription: Subscription | null) => void,
  ): () => void;
}
