import { SubscriptionBaseQuery } from "@core/subscription/gateways/subscription-base-query";

import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { RevenueCatSubscriptionRuntime } from "@core/subscription/adapters/revenuecat/revenue-cat-subscription-runtime";

/**
 * Creates a consistent unavailable result when RevenueCat cannot complete an action.
 */
function unavailableResult(message: string): SubscriptionActionResult {
  return {
    success: false,
    errorMessage: message,
  };
}

/**
 * RevenueCat-backed gateway for premium offerings, purchases, and restore flows.
 */
export class RevenueCatSubscriptionBaseQuery extends SubscriptionBaseQuery {
  /**
   * Receives the platform RevenueCat runtime used by every billing action.
   */
  constructor(private readonly runtime: RevenueCatSubscriptionRuntime) {
    super();
  }

  /**
   * Loads RevenueCat offerings only when the native runtime is configured.
   */
  async retrieveSubscriptionOfferings() {
    if (!this.runtime.isConfigured()) {
      return [];
    }

    return this.runtime.retrieveOfferings();
  }

  /**
   * Purchases the selected premium plan through RevenueCat and normalizes errors.
   */
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

  /**
   * Restores RevenueCat purchases and accepts only active premium entitlements.
   */
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

  /**
   * Opens the platform subscription management screen through RevenueCat.
   */
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

  /**
   * Reads the RevenueCat subscription state when billing is available.
   */
  async retrieveSubscriptionStatus(): Promise<Subscription | null> {
    if (!this.runtime.isConfigured()) {
      return null;
    }

    return this.runtime.retrieveSubscriptionStatus();
  }
}
