import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "../apis/types";
import type { Subscription } from "../domain/subscription";
import type { SubscriptionOffering } from "../domain/subscription-offering";

/** Internal request contract accepted by the subscription RTK Query adapter. */
type SubscriptionRequest =
  | { url: "/offerings/retrieve"; method: "GET"; body?: undefined }
  | { url: "/purchase"; method: "POST"; body: PurchaseSubscriptionPayload }
  | { url: "/restore"; method: "POST"; body?: undefined }
  | { url: "/manage"; method: "POST"; body?: undefined }
  | { url: "/status/retrieve"; method: "GET"; body?: undefined };

/** Gateway contract used by subscription endpoints to swap billing adapters. */
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

  abstract retrieveSubscriptionOfferings(): Promise<SubscriptionOffering[]>;

  abstract purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionActionResult>;

  abstract restoreSubscriptionPurchases(): Promise<SubscriptionActionResult>;

  abstract openSubscriptionManagement(): Promise<SubscriptionActionResult>;

  abstract retrieveSubscriptionStatus(): Promise<Subscription | null>;
}
