import {
  isContextApplicationError,
  isTechnicalApplicationError,
} from "@core/shared/domain/application-error";

import type { ApplicationError } from "@core/shared/domain/application-error";

/** Stable authentication failures independent from providers and UI copy. */
export type AuthErrorCode =
  | "ACCOUNT_NOT_FOUND"
  | "EMAIL_NOT_CONFIRMED"
  | "EMAIL_TAKEN"
  | "INVALID_CREDENTIALS"
  | "OAUTH_CANCELLED"
  | "PASSWORD_RESET_EXPIRED"
  | "PASSWORD_RESET_INVALID"
  | "PROVIDER_UNAVAILABLE"
  | "WEAK_PASSWORD";

/** Failure exposed by authentication use-cases. */
export type AuthError = ApplicationError<AuthErrorCode>;

/** Narrows an unknown failure to the authentication error contract. */
export function isAuthError(value: unknown): value is AuthError {
  if (isTechnicalApplicationError(value)) return true;

  return isContextApplicationError(value) && isAuthErrorCode(value.code);
}

/** Checks whether a stable error code belongs to authentication. */
function isAuthErrorCode(value: string): value is AuthErrorCode {
  return (
    value === "ACCOUNT_NOT_FOUND" ||
    value === "EMAIL_NOT_CONFIRMED" ||
    value === "EMAIL_TAKEN" ||
    value === "INVALID_CREDENTIALS" ||
    value === "OAUTH_CANCELLED" ||
    value === "PASSWORD_RESET_EXPIRED" ||
    value === "PASSWORD_RESET_INVALID" ||
    value === "PROVIDER_UNAVAILABLE" ||
    value === "WEAK_PASSWORD"
  );
}
