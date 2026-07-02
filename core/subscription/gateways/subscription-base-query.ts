import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";

/**
 * Internal request contract accepted by the subscription RTK Query adapter.
 */
type SubscriptionRequest =
  | { url: "/offerings/retrieve"; method: "GET"; body?: undefined }
  | { url: "/purchase"; method: "POST"; body: PurchaseSubscriptionPayload }
  | { url: "/restore"; method: "POST"; body?: undefined }
  | { url: "/manage"; method: "POST"; body?: undefined }
  | { url: "/status/retrieve"; method: "GET"; body?: undefined };

/**
 * Gateway contract used by subscription endpoints to swap billing adapters.
 */
export abstract class SubscriptionBaseQuery {
  public handle = (): BaseQueryFn<SubscriptionRequest> => async (request) => {
    if (request.url === "/offerings/retrieve") {
      return { data: await this.retrieveSubscriptionOfferings() };
    }

    if (request.url === "/purchase") {
      return { data: await this.purchaseSubscription(request.body) };
    }

    if (request.url === "/restore") {
      return { data: await this.restoreSubscriptionPurchases() };
    }

    if (request.url === "/manage") {
      return { data: await this.openSubscriptionManagement() };
    }

    if (request.url === "/status/retrieve") {
      return { data: await this.retrieveSubscriptionStatus() };
    }

    return { data: { success: false, errorMessage: "Unknown action." } };
  };

  /**
   * Retrieves the purchasable subscription offerings for the paywall.
   */
  abstract retrieveSubscriptionOfferings(): Promise<SubscriptionOffering[]>;

  /**
   * Purchases the selected subscription plan through the active billing adapter.
   */
  abstract purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionActionResult>;

  /**
   * Restores previous platform purchases for the current user.
   */
  abstract restoreSubscriptionPurchases(): Promise<SubscriptionActionResult>;

  /**
   * Opens the platform flow where the user can manage an existing subscription.
   */
  abstract openSubscriptionManagement(): Promise<SubscriptionActionResult>;

  /**
   * Retrieves the current subscription state used during app startup.
   */
  abstract retrieveSubscriptionStatus(): Promise<Subscription | null>;
}
