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

/**
 * Result for subscription actions that can change premium entitlement.
 */
export type SubscriptionActionResult =
  | {
      success: true;
      subscription: Subscription;
      plan: SubscriptionPlan;
    }
  | {
      success: false;
      errorMessage: string;
    };
