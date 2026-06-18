import { sleep } from "../../../lib/sleep";
import {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "../../apis/types";
import { Subscription } from "../../domain/subscription";
import { SubscriptionOffering } from "../../domain/subscription-offering";
import { SubscriptionBaseQuery } from "../../gateways/subscription-base-query";
import { InMemorySubscriptionBaseQuery } from "../in-memory/in-memory-subscription-base-query";

export class FakeSubscriptionBaseQuery extends SubscriptionBaseQuery {
  private readonly inMemoryBaseQuery = new InMemorySubscriptionBaseQuery();

  async retrieveSubscriptionOfferings(): Promise<SubscriptionOffering[]> {
    await sleep(800);
    return this.inMemoryBaseQuery.retrieveSubscriptionOfferings();
  }

  async purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionActionResult> {
    await sleep(1200);
    return this.inMemoryBaseQuery.purchaseSubscription(payload);
  }

  async restoreSubscriptionPurchases(): Promise<SubscriptionActionResult> {
    await sleep(1200);
    return this.inMemoryBaseQuery.restoreSubscriptionPurchases();
  }

  async openSubscriptionManagement(): Promise<SubscriptionActionResult> {
    await sleep(600);
    return this.inMemoryBaseQuery.openSubscriptionManagement();
  }

  async retrieveSubscriptionStatus(): Promise<Subscription | null> {
    await sleep(600);
    return this.inMemoryBaseQuery.retrieveSubscriptionStatus();
  }
}
