import {
  isContextApplicationError,
  isTechnicalApplicationError,
} from "@core/shared/domain/application-error";

import type { ApplicationError } from "@core/shared/domain/application-error";

/** Defines the account error code contract. */
export type AccountErrorCode = "ACCOUNT_NOT_FOUND" | "DISPLAY_NAME_TOO_LONG";

/** Defines the account error contract. */
export type AccountError = ApplicationError<AccountErrorCode>;

/** Narrows an unknown failure to the Account error contract. */
export function isAccountError(value: unknown): value is AccountError {
  if (isTechnicalApplicationError(value)) return true;

  return (
    isContextApplicationError(value) &&
    (value.code === "ACCOUNT_NOT_FOUND" ||
      value.code === "DISPLAY_NAME_TOO_LONG")
  );
}
