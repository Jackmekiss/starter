import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PACKAGE_TYPE,
  PurchasesOffering
} from "react-native-purchases";
import { Subscription } from "../../core/auth/domain/subscription";
import { RevenueCatSubscriptionRuntime } from "../../core/subscription/adapters/revenuecat/revenueCatSubscriptionRuntime";
import { SubscriptionOffering } from "../../core/subscription/domain/subscriptionOffering";
import { SubscriptionPlan } from "../../core/subscription/domain/subscriptionPlan";

const resolveApiKey = () => {
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  }

  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  }

  return undefined;
};

const resolveEntitlementId = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? "premium";

const isPurchasesPlatformSupported = () =>
  Platform.OS === "ios" || Platform.OS === "android";

const planOrder: SubscriptionPlan[] = ["annual", "monthly"];

const toPlan = (packageType: PACKAGE_TYPE, identifier: string) => {
  if (
    packageType === PACKAGE_TYPE.ANNUAL ||
    identifier.toLowerCase().includes("annual") ||
    identifier.toLowerCase().includes("year")
  ) {
    return "annual";
  }

  return "monthly";
};

const getOfferingPackages = (offering: PurchasesOffering) =>
  offering.availablePackages
    .map((aPackage) => {
      const plan = toPlan(aPackage.packageType, aPackage.identifier);
      const periodLabel = plan === "annual" ? "/yr" : "/mo";
      const detailsLabel =
        plan === "annual"
          ? `${aPackage.product.priceString} billed yearly`
          : undefined;

      return {
        id: aPackage.identifier,
        plan,
        title: plan === "annual" ? "Annual Plan" : "Monthly Plan",
        priceLabel:
          aPackage.product.pricePerMonthString ?? aPackage.product.priceString,
        periodLabel,
        detailsLabel,
        badgeLabel: plan === "annual" ? "Best Value" : undefined,
        savingsLabel:
          plan === "annual" && aPackage.product.pricePerMonth != null
            ? undefined
            : undefined
      } satisfies SubscriptionOffering;
    })
    .sort(
      (left, right) =>
        planOrder.indexOf(left.plan) - planOrder.indexOf(right.plan)
    );

const resolveMatchingPackage = (
  offering: PurchasesOffering,
  plan: SubscriptionPlan
) =>
  offering.availablePackages.find(
    (aPackage) => toPlan(aPackage.packageType, aPackage.identifier) === plan
  );

const mapCustomerInfoToSubscription = (
  customerInfo: CustomerInfo
): Subscription | null => {
  const entitlementId = resolveEntitlementId();
  const entitlement =
    customerInfo.entitlements.active[entitlementId] ??
    customerInfo.entitlements.all[entitlementId];

  if (!entitlement) {
    return {
      tier: "free",
      status: "inactive",
      cancelAtPeriodEnd: false
    };
  }

  if (!entitlement.isActive) {
    return {
      tier: "free",
      status: "inactive",
      cancelAtPeriodEnd: false
    };
  }

  const plan = toPlan(
    entitlement.productIdentifier.toLowerCase().includes("annual")
      ? PACKAGE_TYPE.ANNUAL
      : PACKAGE_TYPE.MONTHLY,
    entitlement.productIdentifier
  );

  return {
    tier: "premium",
    plan,
    status: entitlement.periodType === "TRIAL" ? "trialing" : "active",
    currentPeriodEnd: entitlement.expirationDate ?? undefined,
    trialEnd:
      entitlement.periodType === "TRIAL"
        ? (entitlement.expirationDate ?? undefined)
        : undefined,
    cancelAtPeriodEnd: !entitlement.willRenew
  };
};

let hasConfiguredPurchases = false;
let currentRevenueCatUserId: string | null = null;

export const createRevenueCatRuntime = (): RevenueCatSubscriptionRuntime => ({
  isConfigured() {
    return isPurchasesPlatformSupported() && Boolean(resolveApiKey());
  },
  async configure(appUserId) {
    if (!this.isConfigured() || hasConfiguredPurchases) {
      return;
    }

    Purchases.configure({
      apiKey: resolveApiKey()!,
      appUserID: appUserId
    });
    hasConfiguredPurchases = true;
    currentRevenueCatUserId = appUserId ?? null;
  },
  async syncIdentity(appUserId) {
    await this.configure(appUserId);

    if (!this.isConfigured()) {
      return;
    }

    if (appUserId && currentRevenueCatUserId !== appUserId) {
      await Purchases.logIn(appUserId);
      currentRevenueCatUserId = appUserId;
      return;
    }

    if (!appUserId && currentRevenueCatUserId) {
      await Purchases.logOut();
      currentRevenueCatUserId = null;
    }
  },
  async retrieveOfferings() {
    await this.configure(currentRevenueCatUserId ?? undefined);
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      return [];
    }

    return getOfferingPackages(offerings.current);
  },
  async purchasePlan(plan) {
    await this.configure(currentRevenueCatUserId ?? undefined);
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      throw new Error("No offering available.");
    }

    const aPackage = resolveMatchingPackage(offerings.current, plan);

    if (!aPackage) {
      throw new Error("Selected plan unavailable.");
    }

    const result = await Purchases.purchasePackage(aPackage);
    const subscription = mapCustomerInfoToSubscription(result.customerInfo);

    if (!subscription) {
      throw new Error("Subscription unavailable.");
    }

    return {
      plan,
      subscription
    };
  },
  async restorePurchases() {
    await this.configure(currentRevenueCatUserId ?? undefined);
    const customerInfo = await Purchases.restorePurchases();

    return mapCustomerInfoToSubscription(customerInfo);
  },
  async retrieveSubscriptionStatus() {
    await this.configure(currentRevenueCatUserId ?? undefined);
    const customerInfo = await Purchases.getCustomerInfo();

    return mapCustomerInfoToSubscription(customerInfo);
  },
  async openManageSubscriptions() {
    await this.configure(currentRevenueCatUserId ?? undefined);
    await Purchases.showManageSubscriptions();
  },
  addSubscriptionStatusListener(listener) {
    const callback = (customerInfo: CustomerInfo) => {
      listener(mapCustomerInfoToSubscription(customerInfo));
    };

    Purchases.addCustomerInfoUpdateListener(callback);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(callback);
    };
  }
});
