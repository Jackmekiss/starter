import type { Subscription } from "@core/subscription/domain/subscription";

/**
 * Subscription fixture overrides accepted by the fluent builder.
 */
type SubscriptionBuilderProps = Partial<Subscription>;

/**
 * Creates fluent subscription fixtures for domain and use-case behavior specs.
 */
export function subscriptionBuilder(
  propsOverride: SubscriptionBuilderProps = {},
) {
  const props: Subscription = {
    tier: propsOverride.tier ?? "premium",
    plan: "plan" in propsOverride ? propsOverride.plan : "annual",
    status: propsOverride.status ?? "active",
    price:
      "price" in propsOverride
        ? propsOverride.price
        : {
            amount: 5999,
            currency: "EUR",
          },
    currentPeriodEnd:
      "currentPeriodEnd" in propsOverride
        ? propsOverride.currentPeriodEnd
        : "2027-06-17T00:00:00.000Z",
    trialEnd: propsOverride.trialEnd,
    cancelAtPeriodEnd: propsOverride.cancelAtPeriodEnd ?? false,
  };

  return {
    /**
     * Returns a new subscription builder with the provided access tier.
     */
    withTier(value: Subscription["tier"]) {
      return subscriptionBuilder({
        ...props,
        tier: value,
      });
    },

    /**
     * Returns a new subscription builder with the provided billing plan.
     */
    withPlan(value: Subscription["plan"]) {
      return subscriptionBuilder({
        ...props,
        plan: value,
      });
    },

    /**
     * Returns a new subscription builder without a billing plan.
     */
    withoutPlan() {
      return subscriptionBuilder({
        ...props,
        plan: undefined,
      });
    },

    /**
     * Returns a new subscription builder with the provided lifecycle status.
     */
    withStatus(value: Subscription["status"]) {
      return subscriptionBuilder({
        ...props,
        status: value,
      });
    },

    /**
     * Returns a new subscription builder with the provided price metadata.
     */
    withPrice(value: Subscription["price"]) {
      return subscriptionBuilder({
        ...props,
        price: value,
      });
    },

    /**
     * Returns a new subscription builder without price metadata.
     */
    withoutPrice() {
      return subscriptionBuilder({
        ...props,
        price: undefined,
      });
    },

    /**
     * Returns a new subscription builder with the provided period end.
     */
    withCurrentPeriodEnd(value: Subscription["currentPeriodEnd"]) {
      return subscriptionBuilder({
        ...props,
        currentPeriodEnd: value,
      });
    },

    /**
     * Returns a new subscription builder without a current period end.
     */
    withoutCurrentPeriodEnd() {
      return subscriptionBuilder({
        ...props,
        currentPeriodEnd: undefined,
      });
    },

    /**
     * Returns a new subscription builder with the provided trial end.
     */
    withTrialEnd(value: Subscription["trialEnd"]) {
      return subscriptionBuilder({
        ...props,
        trialEnd: value,
      });
    },

    /**
     * Returns a new subscription builder with the provided renewal setting.
     */
    withCancelAtPeriodEnd(value: Subscription["cancelAtPeriodEnd"]) {
      return subscriptionBuilder({
        ...props,
        cancelAtPeriodEnd: value,
      });
    },

    /**
     * Builds the subscription entity represented by the current builder state.
     */
    build(): Subscription {
      return {
        tier: props.tier,
        plan: props.plan,
        status: props.status,
        price: props.price,
        currentPeriodEnd: props.currentPeriodEnd,
        trialEnd: props.trialEnd,
        cancelAtPeriodEnd: props.cancelAtPeriodEnd,
      };
    },
  };
}
