import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionError } from "@core/subscription/domain/subscription-error";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionResult } from "@core/subscription/domain/subscription-result";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/** Internal request contract accepted by subscription RTK Query endpoints. */
export type SubscriptionRequest =
  | { url: "/offerings/retrieve"; method: "GET" }
  | { url: "/purchase"; method: "POST"; body: PurchaseSubscriptionPayload }
  | { url: "/restore"; method: "POST" }
  | { url: "/manage"; method: "POST" }
  | { url: "/status/retrieve"; method: "GET" };

/** Typed base-query contract shared by subscription use-cases. */
export type SubscriptionBaseQueryFn = BaseQueryFn<
  SubscriptionRequest,
  unknown,
  SubscriptionError
>;

/** Gateway contract used by subscription endpoints to swap billing adapters. */
export abstract class SubscriptionBaseQuery {
  /** Converts typed adapter results into RTK Query data or error channels. */
  handle(): SubscriptionBaseQueryFn {
    return async (request) => {
      const result = await this.routeRequest(request);
      if (!result.ok) return { error: result.error };
      return { data: result.value };
    };
  }

  /** Routes one internal request to its domain-oriented operation. */
  private routeRequest(
    request: SubscriptionRequest,
  ): Promise<SubscriptionResult<unknown>> {
    switch (request.url) {
      case "/offerings/retrieve":
        return this.retrieveSubscriptionOfferings();
      case "/purchase":
        return this.purchaseSubscription(request.body);
      case "/restore":
        return this.restoreSubscriptionPurchases();
      case "/manage":
        return this.openSubscriptionManagement();
      case "/status/retrieve":
        return this.retrieveSubscriptionStatus();
      default:
        return Promise.resolve({
          ok: false,
          error: { kind: "unexpected", retryable: false },
        });
    }
  }

  /** Retrieves purchasable offerings for the paywall. */
  abstract retrieveSubscriptionOfferings(): Promise<
    SubscriptionResult<SubscriptionOffering[]>
  >;

  /** Purchases the selected subscription plan. */
  abstract purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionResult<SubscriptionActionResult>>;

  /** Restores previous platform purchases. */
  abstract restoreSubscriptionPurchases(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  >;

  /** Opens platform subscription management. */
  abstract openSubscriptionManagement(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  >;

  /** Retrieves the current subscription entitlement. */
  abstract retrieveSubscriptionStatus(): Promise<
    SubscriptionResult<Subscription | null>
  >;
}
