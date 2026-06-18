import type { Subscription } from "../../domain/subscription";
import type { SubscriptionOffering } from "../../domain/subscription-offering";
import type { SubscriptionPlan } from "../../domain/subscription-plan";

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
