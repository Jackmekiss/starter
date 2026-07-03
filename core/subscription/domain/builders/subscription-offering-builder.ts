import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";

/**
 * Creates fluent subscription offering fixtures for use-case behavior specs.
 */
export function subscriptionOfferingBuilder({
  id = "premium-annual",
  plan = "annual",
  title = "Annual Premium",
  priceLabel = "$59.99",
  periodLabel = "year",
  detailsLabel = "Billed yearly",
  badgeLabel = "Best value",
  savingsLabel = "Save 38%",
}: Partial<SubscriptionOffering> = {}) {
  const props: SubscriptionOffering = {
    id,
    plan,
    title,
    priceLabel,
    periodLabel,
    detailsLabel,
    badgeLabel,
    savingsLabel,
  };

  return {
    /**
     * Returns a new offering builder with the provided identifier.
     */
    withId(value: SubscriptionOffering["id"]) {
      return subscriptionOfferingBuilder({
        ...props,
        id: value,
      });
    },

    /**
     * Returns a new offering builder with the provided billing plan.
     */
    withPlan(value: SubscriptionOffering["plan"]) {
      return subscriptionOfferingBuilder({
        ...props,
        plan: value,
      });
    },

    /**
     * Returns a new offering builder with the provided title.
     */
    withTitle(value: SubscriptionOffering["title"]) {
      return subscriptionOfferingBuilder({
        ...props,
        title: value,
      });
    },

    /**
     * Returns a new offering builder with the provided price label.
     */
    withPriceLabel(value: SubscriptionOffering["priceLabel"]) {
      return subscriptionOfferingBuilder({
        ...props,
        priceLabel: value,
      });
    },

    /**
     * Returns a new offering builder with the provided period label.
     */
    withPeriodLabel(value: SubscriptionOffering["periodLabel"]) {
      return subscriptionOfferingBuilder({
        ...props,
        periodLabel: value,
      });
    },

    /**
     * Builds the offering represented by the current builder state.
     */
    build(): SubscriptionOffering {
      return {
        id: props.id,
        plan: props.plan,
        title: props.title,
        priceLabel: props.priceLabel,
        periodLabel: props.periodLabel,
        detailsLabel: props.detailsLabel,
        badgeLabel: props.badgeLabel,
        savingsLabel: props.savingsLabel,
      };
    },
  };
}
