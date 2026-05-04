import { Subscription } from "../domain/subscription";
import { SubscriptionPlan } from "../domain/subscriptionPlan";

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
