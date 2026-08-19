import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionPlan } from "@core/subscription/domain/subscription-plan";

/**
 * Selected premium plan to purchase through the subscription gateway.
 */
export interface PurchaseSubscriptionPayload {
  /**
   * Premium billing interval selected from the paywall.
   */
  plan: SubscriptionPlan;
}

/** Successful subscription action that can change premium entitlement. */
export interface SubscriptionActionResult {
  /** Premium entitlement resolved by the billing adapter. */
  subscription: Subscription;
  /** Billing interval associated with the action. */
  plan: SubscriptionPlan;
}
