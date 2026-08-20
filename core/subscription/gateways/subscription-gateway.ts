import type {
  PurchaseSubscriptionPayload,
  SubscriptionActionResult,
} from "@core/subscription/apis/types";
import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionResult } from "@core/subscription/domain/subscription-result";

/** Domain-oriented subscription operations implemented by replaceable adapters. */
export abstract class SubscriptionGateway {
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
