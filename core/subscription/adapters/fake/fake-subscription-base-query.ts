import { InMemorySubscriptionBaseQuery } from "@core/subscription/adapters/in-memory/in-memory-subscription-base-query";
import { SubscriptionBaseQuery } from "@core/subscription/gateways/subscription-base-query";
import { sleep } from "@core/lib/sleep";

import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionResult } from "@core/subscription/domain/subscription-result";

/** Fake subscription gateway that adds latency to in-memory billing. */
export class FakeSubscriptionBaseQuery extends SubscriptionBaseQuery {
  private readonly inMemoryBaseQuery = new InMemorySubscriptionBaseQuery();

  /** Retrieves simulated paywall offerings. */
  async retrieveSubscriptionOfferings(): Promise<
    SubscriptionResult<SubscriptionOffering[]>
  > {
    await sleep(800);
    return this.inMemoryBaseQuery.retrieveSubscriptionOfferings();
  }

  /** Simulates a purchase round trip. */
  async purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionResult<SubscriptionActionResult>> {
    await sleep(1200);
    return this.inMemoryBaseQuery.purchaseSubscription(payload);
  }

  /** Simulates restoring purchases. */
  async restoreSubscriptionPurchases(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    await sleep(1200);
    return this.inMemoryBaseQuery.restoreSubscriptionPurchases();
  }

  /** Simulates opening subscription management. */
  async openSubscriptionManagement(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    await sleep(600);
    return this.inMemoryBaseQuery.openSubscriptionManagement();
  }

  /** Retrieves the simulated subscription status. */
  async retrieveSubscriptionStatus(): Promise<
    SubscriptionResult<Subscription | null>
  > {
    await sleep(600);
    return this.inMemoryBaseQuery.retrieveSubscriptionStatus();
  }
}
