import type { Subscription } from "@core/subscription/domain/subscription";
import type { SubscriptionOffering } from "@core/subscription/domain/subscription-offering";
import type { SubscriptionPlan } from "@core/subscription/domain/subscription-plan";

/**
 * Runtime bridge that isolates RevenueCat SDK details from subscription use-cases.
 */
export interface RevenueCatSubscriptionRuntime {
  isConfigured(): boolean;
  configure(appUserId?: string): Promise<void>;
  syncIdentity(appUserId?: string): Promise<void>;
  retrieveOfferings(): Promise<SubscriptionOffering[]>;
  purchasePlan(
    plan: SubscriptionPlan,
  ): Promise<{ plan: SubscriptionPlan; subscription: Subscription }>;
  restorePurchases(): Promise<Subscription | null>;
  retrieveSubscriptionStatus(): Promise<Subscription | null>;
  openManageSubscriptions(): Promise<void>;
  addSubscriptionStatusListener(
    listener: (subscription: Subscription | null) => void,
  ): () => void;
}
