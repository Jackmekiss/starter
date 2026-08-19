import { isContextApplicationError } from "@core/shared/domain/application-error";
import { isAuthError } from "@core/auth/domain/auth-error";

import type { TFunction } from "i18next";

/** Presentation context needed when a technical error has flow-specific copy. */
export interface ResolveAuthErrorMessageOptions {
  /** Authentication action that rejected. */
  action?: "login" | "oauth" | "password-reset" | "registration";
  /** Safe copy returned for unknown or unmapped failures. */
  fallbackMessage: string;
}

/** Resolves an authentication rejection into safe localized copy. */
export function resolveAuthErrorMessage(
  error: unknown,
  resolveMessage: TFunction,
  options: ResolveAuthErrorMessageOptions,
): string {
  if (!isAuthError(error)) return options.fallbackMessage;

  if (isContextApplicationError(error)) {
    return resolveAuthBusinessErrorMessage(error.code, resolveMessage, options);
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

/** Maps stable auth codes while preserving flow-specific meaning. */
function resolveAuthBusinessErrorMessage(
  code: string,
  resolveMessage: TFunction,
  options: ResolveAuthErrorMessageOptions,
): string {
  switch (code) {
    case "INVALID_CREDENTIALS":
      return resolveMessage("auth__login__error__invalid_credentials");
    case "EMAIL_NOT_CONFIRMED":
      return resolveMessage("auth__login__error__email_not_confirmed");
    case "EMAIL_TAKEN":
      return resolveMessage("auth__registration__error__email_taken");
    case "WEAK_PASSWORD":
      return resolveMessage("auth__registration__error__weak_password");
    case "PASSWORD_RESET_EXPIRED":
      return resolveMessage("auth__password_reset__error__expired");
    case "PASSWORD_RESET_INVALID":
      return resolveMessage("auth__password_reset__error__invalid");
    case "OAUTH_CANCELLED":
      return options.action === "oauth"
        ? resolveMessage("auth__oauth__error__cancelled")
        : options.fallbackMessage;
    case "ACCOUNT_NOT_FOUND":
    default:
      return options.fallbackMessage;
  }
}
