import { InMemorySubscriptionGateway } from "@core/subscription/adapters/in-memory/in-memory-subscription-gateway";
import { SubscriptionGateway } from "@core/subscription/gateways/subscription-gateway";
import { sleep } from "@core/lib/sleep";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionResult } from "@core/subscription/domain/subscription-result";
import type { DateProvider } from "@core/shared/gateways/date-provider";

/** Fake subscription gateway that adds latency to in-memory billing. */
export class FakeSubscriptionGateway extends SubscriptionGateway {
  private readonly inMemoryGateway: InMemorySubscriptionGateway;

  /** Creates delayed subscription behavior against an injected clock. */
  constructor(dateProvider: DateProvider = new DeterministicDateProvider()) {
    super();
    this.inMemoryGateway = new InMemorySubscriptionGateway(dateProvider);
  }

  /** Retrieves simulated paywall offerings. */
  async retrieveSubscriptionOfferings(): Promise<
    SubscriptionResult<SubscriptionOffering[]>
  > {
    await sleep(800);
    return this.inMemoryGateway.retrieveSubscriptionOfferings();
  }

  /** Simulates a purchase round trip. */
  async purchaseSubscription(
    payload: PurchaseSubscriptionPayload,
  ): Promise<SubscriptionResult<SubscriptionActionResult>> {
    await sleep(1200);
    return this.inMemoryGateway.purchaseSubscription(payload);
  }

  /** Simulates restoring purchases. */
  async restoreSubscriptionPurchases(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    await sleep(1200);
    return this.inMemoryGateway.restoreSubscriptionPurchases();
  }

  /** Simulates opening subscription management. */
  async openSubscriptionManagement(): Promise<
    SubscriptionResult<SubscriptionActionResult>
  > {
    await sleep(600);
    return this.inMemoryGateway.openSubscriptionManagement();
  }

  /** Retrieves the simulated subscription status. */
  async retrieveSubscriptionStatus(): Promise<
    SubscriptionResult<Subscription | null>
  > {
    await sleep(600);
    return this.inMemoryGateway.retrieveSubscriptionStatus();
  }
}
