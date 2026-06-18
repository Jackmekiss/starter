import {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "../../apis/types";
import { Subscription } from "../../domain/subscription";
import { SubscriptionOffering } from "../../domain/subscription-offering";
import { SubscriptionBaseQuery } from "../../gateways/subscription-base-query";

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

const createPremiumSubscription = (
  plan: PurchaseSubscriptionPayload["plan"],
): Subscription => ({
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
});

const createFailureResult = (message: string): SubscriptionActionResult => ({
  success: false,
  errorMessage: message,
});

export class InMemorySubscriptionBaseQuery extends SubscriptionBaseQuery {
  async retrieveSubscriptionOfferings(): Promise<SubscriptionOffering[]> {
    return defaultSubscriptionOfferings;
  }

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

  async openSubscriptionManagement(): Promise<SubscriptionActionResult> {
    return {
      success: true,
      subscription: currentSubscription,
      plan: currentSubscription.plan ?? "annual",
    };
  }

  async retrieveSubscriptionStatus(): Promise<Subscription | null> {
    return currentSubscription;
  }
}
