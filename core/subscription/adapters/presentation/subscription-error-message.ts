import { isContextApplicationError } from "@core/shared/domain/application-error";
import { isSubscriptionError } from "@core/subscription/domain/subscription-error";

import type { TFunction } from "i18next";

/** Presentation context needed when a subscription error has flow-specific copy. */
export interface ResolveSubscriptionErrorMessageOptions {
  /** Subscription action that rejected. */
  action?: "restore";
  /** Safe copy returned for unknown or unmapped failures. */
  fallbackMessage: string;
}

/** Resolves a subscription rejection into safe localized copy. */
export function resolveSubscriptionErrorMessage(
  error: unknown,
  resolveMessage: TFunction,
  options: ResolveSubscriptionErrorMessageOptions,
): string {
  if (!isSubscriptionError(error)) return options.fallbackMessage;

  if (isContextApplicationError(error)) {
    return error.code === "NO_ACTIVE_PURCHASE" && options.action === "restore"
      ? resolveMessage("subscription__restore__error__no_active_purchase")
      : options.fallbackMessage;
  }

  switch (error.kind) {
    case "network":
      return resolveMessage("common__error__network");
    case "timeout":
      return resolveMessage("common__error__timeout");
    case "rate-limited":
      return resolveMessage("common__error__rate_limited");
    case "unavailable":
      return resolveMessage("common__error__unavailable");
    case "unauthenticated":
    case "forbidden":
    case "unexpected":
    default:
      return options.fallbackMessage;
  }
}
