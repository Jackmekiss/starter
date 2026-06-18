import type { Subscription } from "../domain/subscription";
import type { SubscriptionPlan } from "../domain/subscription-plan";

export interface PurchaseSubscriptionPayload {
  plan: SubscriptionPlan;
}

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
