import {
  isContextApplicationError,
  isTechnicalApplicationError,
} from "@core/shared/domain/application-error";

import type { ApplicationError } from "@core/shared/domain/application-error";

/** Stable subscription failures independent from billing SDK and UI copy. */
export type SubscriptionErrorCode = "NO_ACTIVE_PURCHASE";

/** Failure exposed by subscription use-cases. */
export type SubscriptionError = ApplicationError<SubscriptionErrorCode>;

/** Narrows an unknown failure to the subscription error contract. */
export function isSubscriptionError(
  value: unknown,
): value is SubscriptionError {
  if (isTechnicalApplicationError(value)) return true;

  return (
    isContextApplicationError(value) && value.code === "NO_ACTIVE_PURCHASE"
  );
}
