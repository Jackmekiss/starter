import { isAuthError } from "@core/auth/domain/auth-error";

import type { AuthError } from "@core/auth/domain/auth-error";

/** Preserves authentication failures and hides unexpected adapter details. */
export function mapAuthAdapterError(error: unknown): AuthError {
  return (
    readAuthAdapterError(error) ?? {
      kind: "unexpected",
      retryable: false,
    }
  );
}

/** Reads an authentication failure returned directly or wrapped by an adapter. */
function readAuthAdapterError(error: unknown): AuthError | undefined {
  if (isAuthError(error)) return error;
  if (error instanceof Error && isAuthError(error.cause)) return error.cause;
  return undefined;
}
