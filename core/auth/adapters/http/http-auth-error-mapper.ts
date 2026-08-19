import { mapAuthAdapterError } from "@core/auth/adapters/errors/auth-error-mapper";
import { isAuthError } from "@core/auth/domain/auth-error";

import type { AuthError, AuthErrorCode } from "@core/auth/domain/auth-error";

/** Authentication operation performed by the sample HTTP contract. */
export type HttpAuthOperation =
  | "delete-account"
  | "login"
  | "login-with-apple"
  | "login-with-google"
  | "logout"
  | "register"
  | "request-password-reset"
  | "reset-password"
  | "retrieve-account"
  | "update-account";

const BACKEND_AUTH_CODES: Record<string, AuthErrorCode> = {
  account_missing: "ACCOUNT_NOT_FOUND",
  email_already_registered: "EMAIL_TAKEN",
  email_not_verified: "EMAIL_NOT_CONFIRMED",
  invalid_login_credentials: "INVALID_CREDENTIALS",
  oauth_cancelled: "OAUTH_CANCELLED",
  password_too_weak: "WEAK_PASSWORD",
  reset_token_expired: "PASSWORD_RESET_EXPIRED",
  reset_token_invalid: "PASSWORD_RESET_INVALID",
};

/** Maps a rejected HTTP response to the stable authentication error contract. */
export function mapHttpAuthResponseError(
  operation: HttpAuthOperation,
  status: number,
  responseBody: unknown,
): AuthError {
  const backendError = readBackendAuthError(responseBody);
  if (backendError) return backendError;

  if (status === 408 || status === 504) {
    return { kind: "timeout", retryable: true };
  }

  if (status === 429) {
    return { kind: "rate-limited", retryable: true };
  }

  if (status >= 500) {
    return { kind: "unavailable", retryable: true };
  }

  if (status === 401) {
    return operation === "login"
      ? {
          kind: "business",
          code: "INVALID_CREDENTIALS",
          retryable: false,
        }
      : { kind: "unauthenticated", retryable: false };
  }

  if (status === 403) {
    return { kind: "forbidden", retryable: false };
  }

  if (status === 409 && operation === "register") {
    return {
      kind: "conflict",
      code: "EMAIL_TAKEN",
      retryable: false,
    };
  }

  return { kind: "unexpected", retryable: false };
}

/** Maps network, abort, and preserved adapter failures without leaking exceptions. */
export function mapHttpAuthTransportError(error: unknown): AuthError {
  if (isAuthError(error)) return error;

  if (error instanceof Error && error.name === "AbortError") {
    return { kind: "timeout", retryable: true };
  }

  if (error instanceof TypeError) {
    return { kind: "network", retryable: true };
  }

  return mapAuthAdapterError(error);
}

/** Reads the documented backend error code without exposing its payload. */
function readBackendAuthError(responseBody: unknown): AuthError | undefined {
  if (!isRecord(responseBody) || typeof responseBody.code !== "string") {
    return undefined;
  }

  const code = BACKEND_AUTH_CODES[responseBody.code];
  if (!code) return undefined;

  return {
    kind: resolveBackendAuthErrorKind(code),
    code,
    retryable: false,
  };
}

/** Selects the stable context category associated with one backend code. */
function resolveBackendAuthErrorKind(
  code: AuthErrorCode,
): "business" | "conflict" | "not-found" | "validation" {
  switch (code) {
    case "ACCOUNT_NOT_FOUND":
      return "not-found";
    case "EMAIL_TAKEN":
      return "conflict";
    case "WEAK_PASSWORD":
      return "validation";
    case "EMAIL_NOT_CONFIRMED":
    case "INVALID_CREDENTIALS":
    case "OAUTH_CANCELLED":
    case "PASSWORD_RESET_EXPIRED":
    case "PASSWORD_RESET_INVALID":
    default:
      return "business";
  }
}

/** Narrows external JSON values before reading backend fields. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
