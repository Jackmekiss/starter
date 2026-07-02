import { sleep } from "@core/lib/sleep";
import { SubscriptionBaseQuery } from "@core/subscription/gateways/subscription-base-query";
import { InMemorySubscriptionBaseQuery } from "@core/subscription/adapters/in-memory/in-memory-subscription-base-query";

import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";

/**
 * Fake subscription gateway that simulates purchase latency on memory data.
 */
export class FakeSubscriptionBaseQuery extends SubscriptionBaseQuery {
  private readonly inMemoryBaseQuery = new InMemorySubscriptionBaseQuery();

  /**
   * Retrieves simulated paywall offerings after a short loading delay.
   */
  async retrieveSubscriptionOfferings(): Promise<SubscriptionOffering[]> {
    await sleep(800);
    return this.inMemoryBaseQuery.retrieveSubscriptionOfferings();
  }

  /**
   * Simulates a purchase round trip before activating the local subscription.
   */
  async purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionActionResult> {
    await sleep(1200);
    return this.inMemoryBaseQuery.purchaseSubscription(payload);
  }

  /**
   * Simulates restoring purchases before reading the local subscription state.
   */
  async restoreSubscriptionPurchases(): Promise<SubscriptionActionResult> {
    await sleep(1200);
    return this.inMemoryBaseQuery.restoreSubscriptionPurchases();
  }

  /**
   * Simulates opening subscription management from the local billing adapter.
   */
  async openSubscriptionManagement(): Promise<SubscriptionActionResult> {
    await sleep(600);
    return this.inMemoryBaseQuery.openSubscriptionManagement();
  }

  /**
   * Retrieves the simulated subscription status after a lightweight delay.
   */
  async retrieveSubscriptionStatus(): Promise<Subscription | null> {
    await sleep(600);
    return this.inMemoryBaseQuery.retrieveSubscriptionStatus();
  }
}
