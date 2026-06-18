import type { Subscription } from "../domain/subscription";
import type { SubscriptionPlan } from "../domain/subscription-plan";

/**
 * Selected premium plan to purchase through the subscription gateway.
 */
export interface PurchaseSubscriptionPayload {
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
