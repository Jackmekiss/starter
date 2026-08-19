import { mapSubscriptionAdapterError } from "@core/subscription/adapters/errors/subscription-error-mapper";
import { SubscriptionBaseQuery } from "@core/subscription/gateways/subscription-base-query";

import type { RevenueCatSubscriptionRuntime } from "@core/subscription/adapters/revenuecat/revenue-cat-subscription-runtime";
import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionResult } from "@core/subscription/domain/subscription-result";

/** RevenueCat-backed gateway for premium subscription operations. */
export class RevenueCatSubscriptionBaseQuery extends SubscriptionBaseQuery {
  /** Receives the platform billing runtime. */
  constructor(private readonly runtime: RevenueCatSubscriptionRuntime) {
    super();
  }

  /** Loads offerings when RevenueCat is configured. */
  retrieveSubscriptionOfferings(): Promise<
    SubscriptionResult<SubscriptionOffering[]>
  > {
    if (!this.runtime.isConfigured()) return this.unavailableResult();
    return this.executeOperation(() => this.runtime.retrieveOfferings());
  }

  /** Purchases the selected premium plan. */
  purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionResult<SubscriptionActionResult>> {
    if (!this.runtime.isConfigured()) return this.unavailableResult();

    return this.executeOperation(async () => {
      const result = await this.runtime.purchasePlan(payload.plan);
      return { subscription: result.subscription, plan: result.plan };
    });
  }

  /** Restores RevenueCat purchases when an active entitlement exists. */
  async restoreSubscriptionPurchases(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    if (!this.runtime.isConfigured()) return this.unavailableResult();

    const result = await this.executeOperation(() =>
      this.runtime.restorePurchases(),
    );
    if (!result.ok) return result;

    const subscription = result.value;
    if (!subscription || subscription.tier !== "premium") {
      return {
        ok: false,
        error: {
          kind: "not-found",
          code: "NO_ACTIVE_PURCHASE",
          retryable: false,
        },
      };
    }

    return {
      ok: true,
      value: { subscription, plan: subscription.plan ?? "annual" },
    };
  }

  /** Opens the platform subscription-management screen. */
  async openSubscriptionManagement(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    if (!this.runtime.isConfigured()) return this.unavailableResult();

    const result = await this.executeOperation(() =>
      this.runtime.openManageSubscriptions(),
    );
    if (!result.ok) return result;

    return {
      ok: true,
      value: {
        subscription: {
          tier: "free",
          status: "inactive",
          cancelAtPeriodEnd: false,
        },
        plan: "annual",
      },
    };
  }

  /** Reads the current RevenueCat entitlement. */
  retrieveSubscriptionStatus(): Promise<
    SubscriptionResult<Subscription | null>
  > {
    if (!this.runtime.isConfigured()) return this.unavailableResult();
    return this.executeOperation(() =>
      this.runtime.retrieveSubscriptionStatus(),
    );
  }

  /** Executes one SDK operation without leaking its exceptions. */
  private async executeOperation<Value>(
    operation: () => Value | Promise<Value>,
  ): Promise<SubscriptionResult<Value>> {
    try {
      return { ok: true, value: await operation() };
    } catch (error) {
      return { ok: false, error: mapSubscriptionAdapterError(error) };
    }
  }

  /** Returns the shared technical failure for an unavailable billing runtime. */
  private unavailableResult<Value>(): Promise<SubscriptionResult<Value>> {
    return Promise.resolve({
      ok: false,
      error: { kind: "unavailable", retryable: true },
    });
  }
}
