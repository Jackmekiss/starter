import type { SubscriptionPlan } from "@core/subscription/domain/subscription-plan";

/**
 * Sellable premium option displayed to users before purchase.
 */
export interface SubscriptionOffering {
  id: string;
  plan: SubscriptionPlan;
  title: string;
  priceLabel: string;
  periodLabel: string;
  detailsLabel?: string;
  badgeLabel?: string;
  savingsLabel?: string;
}
