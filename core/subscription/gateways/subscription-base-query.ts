import { BaseQueryFn } from "@reduxjs/toolkit/query";
import {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "../apis/types";
import { Subscription } from "../domain/subscription";
import { SubscriptionOffering } from "../domain/subscription-offering";

export abstract class SubscriptionBaseQuery {
  public handle =
    (): BaseQueryFn<{
      url: string;
      method: "GET" | "POST";
      body: any;
      params: any;
    }> =>
    async ({ url, body }) => {
      if (url === "/offerings/retrieve") {
        return { data: await this.retrieveSubscriptionOfferings() };
      }

      if (url === "/purchase") {
        return { data: await this.purchaseSubscription(body) };
      }

      if (url === "/restore") {
        return { data: await this.restoreSubscriptionPurchases() };
      }

      if (url === "/manage") {
        return { data: await this.openSubscriptionManagement() };
      }

      if (url === "/status/retrieve") {
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
