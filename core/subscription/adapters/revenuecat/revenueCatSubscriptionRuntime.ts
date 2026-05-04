import { Subscription } from "../../domain/subscription";
import { SubscriptionOffering } from "../../domain/subscriptionOffering";
import { SubscriptionPlan } from "../../domain/subscriptionPlan";

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
