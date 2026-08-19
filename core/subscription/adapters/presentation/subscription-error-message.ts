import { isContextApplicationError } from "@core/shared/domain/application-error";
import { isSubscriptionError } from "@core/subscription/domain/subscription-error";

/** Resolves one application message key through the active UI locale. */
export type SubscriptionMessageResolver = (key: string) => string;

/** Resolves a subscription rejection into safe localized copy. */
export function resolveSubscriptionErrorMessage(
  error: unknown,
  resolveMessage: SubscriptionMessageResolver,
  fallbackMessage: string,
): string {
  if (!isSubscriptionError(error)) return fallbackMessage;

  if (isContextApplicationError(error)) {
    return error.code === "NO_ACTIVE_PURCHASE"
      ? resolveMessage("subscription__restore__error__no_active_purchase")
      : fallbackMessage;
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
      return fallbackMessage;
  }
}
