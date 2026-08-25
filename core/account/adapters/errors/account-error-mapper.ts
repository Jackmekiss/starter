import { isAccountError } from "@core/account/domain/account-error";

import type { AccountError } from "@core/account/domain/account-error";

/** Maps account adapter error. */
export function mapAccountAdapterError(error: unknown): AccountError {
  if (isAccountError(error)) return error;
  if (error instanceof Error && isAccountError(error.cause)) {
    return error.cause;
  }

  return { kind: "unexpected", retryable: false };
}
