import { SubscriptionPlan } from "./subscription-plan";

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
