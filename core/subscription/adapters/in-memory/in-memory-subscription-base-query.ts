import { SubscriptionBaseQuery } from "@core/subscription/gateways/subscription-base-query";

import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";

const defaultSubscriptionOfferings: SubscriptionOffering[] = [
  {
    id: "premium-annual",
    plan: "annual",
    title: "Annual Premium",
    priceLabel: "$59.99",
    periodLabel: "year",
    detailsLabel: "Billed yearly",
    badgeLabel: "Best value",
    savingsLabel: "Save 38%",
  },
  {
    id: "premium-monthly",
    plan: "monthly",
    title: "Monthly Premium",
    priceLabel: "$7.99",
    periodLabel: "month",
    detailsLabel: "Billed monthly",
  },
];

let currentSubscription: Subscription = {
  tier: "free",
  status: "inactive",
  cancelAtPeriodEnd: false,
};

/**
 * Builds the local premium subscription granted by the starter purchase flow.
 */
function createPremiumSubscription(
  plan: PurchaseSubscriptionPayload["plan"],
): Subscription {
  return {
    tier: "premium",
    plan,
    status: "active",
    cancelAtPeriodEnd: false,
    currentPeriodEnd: new Date(
      Date.now() +
        (plan === "annual"
          ? 1000 * 60 * 60 * 24 * 365
          : 1000 * 60 * 60 * 24 * 30),
    ).toISOString(),
  };
}

/**
 * Creates a consistent failed billing action result for local subscription flows.
 */
function createFailureResult(message: string): SubscriptionActionResult {
  return {
    success: false,
    errorMessage: message,
  };
}

/**
 * In-memory subscription gateway for local premium status and purchase flows.
 */
export class InMemorySubscriptionBaseQuery extends SubscriptionBaseQuery {
  /**
   * Returns the default paywall offerings bundled with the starter app.
   */
  async retrieveSubscriptionOfferings(): Promise<SubscriptionOffering[]> {
    return defaultSubscriptionOfferings;
  }

  /**
   * Activates a local premium subscription for the selected plan.
   */
  async purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionActionResult> {
    currentSubscription = createPremiumSubscription(payload.plan);

    return {
      success: true,
      subscription: currentSubscription,
      plan: payload.plan,
    };
  }

  /**
   * Restores the current local premium subscription when one exists.
   */
  async restoreSubscriptionPurchases(): Promise<SubscriptionActionResult> {
    if (currentSubscription.tier !== "premium" || !currentSubscription.plan) {
      return createFailureResult("No active premium purchase was found.");
    }

    return {
      success: true,
      subscription: currentSubscription,
      plan: currentSubscription.plan,
    };
  }

  /**
   * Reports successful management access using the current local subscription.
   */
  async openSubscriptionManagement(): Promise<SubscriptionActionResult> {
    return {
      success: true,
      subscription: currentSubscription,
      plan: currentSubscription.plan ?? "annual",
    };
  }

  /**
   * Returns the current local subscription snapshot for app startup checks.
   */
  async retrieveSubscriptionStatus(): Promise<Subscription | null> {
    return currentSubscription;
  }
}
