import type { SubscriptionPlan } from "@core/subscription/domain/subscription-plan";

/**
 * Sellable premium option displayed to users before purchase.
 */
export interface SubscriptionOffering {
  /**
   * Stable offering identifier used by paywall lists and purchase actions.
   */
  id: string;

  /**
   * Premium plan represented by this sellable offering.
   */
  plan: SubscriptionPlan;

  /**
   * Display title shown for the offering.
   */
  title: string;

  /**
   * Localized price text shown before purchase.
   */
  priceLabel: string;

  /**
   * Localized billing interval text shown next to the price.
   */
  periodLabel: string;

  /**
   * Optional secondary billing details shown under the price.
   */
  detailsLabel?: string;

  /**
   * Optional badge used to highlight a recommended offering.
   */
  badgeLabel?: string;

  /**
   * Optional savings copy shown when an offering has a discount message.
   */
  savingsLabel?: string;
}
