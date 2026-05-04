import {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "../../apis/types";
import { Subscription } from "../../domain/subscription";
import { SubscriptionBaseQuery } from "../../gateways/SubscriptionBaseQuery";
import { RevenueCatSubscriptionRuntime } from "./revenueCatSubscriptionRuntime";

const unavailableResult = (message: string): SubscriptionActionResult => ({
  success: false,
  errorMessage: message,
});

export class RevenueCatSubscriptionBaseQuery extends SubscriptionBaseQuery {
  constructor(private readonly runtime: RevenueCatSubscriptionRuntime) {
    super();
  }

  async retrieveSubscriptionOfferings() {
    if (!this.runtime.isConfigured()) {
      return [];
    }

    return this.runtime.retrieveOfferings();
  }

  async purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionActionResult> {
    if (!this.runtime.isConfigured()) {
      return unavailableResult("Subscriptions are not available right now.");
    }

    try {
      const result = await this.runtime.purchasePlan(payload.plan);

      return {
        success: true,
        subscription: result.subscription,
        plan: result.plan,
      };
    } catch {
      return unavailableResult("Unable to complete your purchase right now.");
    }
  }

  async restoreSubscriptionPurchases(): Promise<SubscriptionActionResult> {
    if (!this.runtime.isConfigured()) {
      return unavailableResult("Subscriptions are not available right now.");
    }

    try {
      const subscription = await this.runtime.restorePurchases();

      if (!subscription || subscription.tier !== "premium") {
        return unavailableResult("No active premium purchase was found.");
      }

      return {
        success: true,
        subscription,
        plan: subscription.plan ?? "annual",
      };
    } catch {
      return unavailableResult("Unable to restore purchases right now.");
    }
  }

  async openSubscriptionManagement(): Promise<SubscriptionActionResult> {
    if (!this.runtime.isConfigured()) {
      return unavailableResult("Subscription management is unavailable.");
    }

    try {
      await this.runtime.openManageSubscriptions();

      return {
        success: true,
        subscription: {
          tier: "free",
          status: "inactive",
          cancelAtPeriodEnd: false,
        },
        plan: "annual",
      };
    } catch {
      return unavailableResult("Unable to open subscription management.");
    }
  }

  async retrieveSubscriptionStatus(): Promise<Subscription | null> {
    if (!this.runtime.isConfigured()) {
      return null;
    }

    return this.runtime.retrieveSubscriptionStatus();
  }
}
