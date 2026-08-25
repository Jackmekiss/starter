import type { AccountError } from "@core/account/domain/account-error";
import type { Result } from "@core/shared/domain/result";

/** Defines the account result contract. */
export type AccountResult<Value> = Result<Value, AccountError>;
