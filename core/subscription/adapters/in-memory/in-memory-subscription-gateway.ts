import { mapSubscriptionAdapterError } from "@core/subscription/adapters/errors/subscription-error-mapper";
import { SubscriptionGateway } from "@core/subscription/gateways/subscription-gateway";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionError } from "@core/subscription/domain/subscription-error";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionResult } from "@core/subscription/domain/subscription-result";
import type { DateProvider } from "@core/shared/gateways/date-provider";

/** Builds the local premium entitlement granted by a purchase. */
function createPremiumSubscription(
  plan: PurchaseSubscriptionPayload["plan"],
  currentDate: Date,
): Subscription {
  return {
    tier: "premium",
    plan,
    status: "active",
    cancelAtPeriodEnd: false,
    currentPeriodEnd: new Date(
      currentDate.getTime() +
        (plan === "annual"
          ? 1000 * 60 * 60 * 24 * 365
          : 1000 * 60 * 60 * 24 * 30),
    ).toISOString(),
  };
}

/** In-memory subscription gateway for local premium flows. */
export class InMemorySubscriptionGateway extends SubscriptionGateway {
  private currentError?: SubscriptionError;

  private currentSubscriptionOfferings: SubscriptionOffering[] = [
    {
      id: "premium-annual",
      plan: "annual",
      title: "Annual Premium",
      priceLabel: "€59.99",
      periodLabel: "year",
      detailsLabel: "Billed yearly",
      badgeLabel: "Best value",
      savingsLabel: "Save 38%",
    },
    {
      id: "premium-monthly",
      plan: "monthly",
      title: "Monthly Premium",
      priceLabel: "€7.99",
      periodLabel: "month",
      detailsLabel: "Billed monthly",
    },
  ];

  private currentSubscription: Subscription = {
    tier: "free",
    status: "inactive",
    cancelAtPeriodEnd: false,
  };

  /** Creates local subscription fixtures against an injected clock. */
  constructor(
    private readonly dateProvider: DateProvider = new DeterministicDateProvider(),
  ) {
    super();
  }

  /** Sets the locally returned offerings. */
  set subscriptionOfferings(value: SubscriptionOffering[]) {
    this.currentSubscriptionOfferings = value;
  }

  /** Sets the locally stored entitlement. */
  set subscription(value: Subscription) {
    this.currentSubscription = value;
  }

  /** Sets a deterministic adapter failure for use-case behavior specs. */
  set error(value: SubscriptionError | undefined) {
    this.currentError = value;
  }

  /** Returns the bundled paywall offerings. */
  retrieveSubscriptionOfferings(): Promise<
    SubscriptionResult<SubscriptionOffering[]>
  > {
    return this.executeOperation(() => this.currentSubscriptionOfferings);
  }

  /** Activates a local premium subscription. */
  purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionResult<SubscriptionActionResult>> {
    return this.executeOperation(() => {
      this.currentSubscription = createPremiumSubscription(
        payload.plan,
        this.dateProvider.now(),
      );
      return { subscription: this.currentSubscription, plan: payload.plan };
    });
  }

  /** Restores the current local premium subscription. */
  restoreSubscriptionPurchases(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    if (
      this.currentSubscription.tier !== "premium" ||
      !this.currentSubscription.plan
    ) {
      return Promise.resolve({
        ok: false,
        error: {
          kind: "not-found",
          code: "NO_ACTIVE_PURCHASE",
          retryable: false,
        },
      });
    }

    return Promise.resolve({
      ok: true,
      value: {
        subscription: this.currentSubscription,
        plan: this.currentSubscription.plan,
      },
    });
  }

  /** Reports successful management access for the current entitlement. */
  openSubscriptionManagement(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    return Promise.resolve({
      ok: true,
      value: {
        subscription: this.currentSubscription,
        plan: this.currentSubscription.plan ?? "annual",
      },
    });
  }

  /** Returns the current local entitlement. */
  retrieveSubscriptionStatus(): Promise<
    SubscriptionResult<Subscription | null>
  > {
    return this.executeOperation(() => this.currentSubscription);
  }

  /** Executes a local operation without leaking implementation failures. */
  private async executeOperation<Value>(
    operation: () => Value | Promise<Value>,
  ): Promise<SubscriptionResult<Value>> {
    if (this.currentError) return { ok: false, error: this.currentError };

    try {
      return { ok: true, value: await operation() };
    } catch (error) {
      return { ok: false, error: mapSubscriptionAdapterError(error) };
    }
  }
}
