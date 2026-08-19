import { isSubscriptionError } from "@core/subscription/domain/subscription-error";

import type { SubscriptionError } from "@core/subscription/domain/subscription-error";

/** Preserves subscription failures and hides unexpected adapter details. */
export function mapSubscriptionAdapterError(error: unknown): SubscriptionError {
  if (isSubscriptionError(error)) return error;

  if (error instanceof Error && isSubscriptionError(error.cause)) {
    return error.cause;
  }

  return { kind: "unexpected", retryable: false };
}
