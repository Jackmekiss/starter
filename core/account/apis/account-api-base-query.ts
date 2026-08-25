import type { AccountError } from "@core/account/domain/account-error";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/** Defines the account api base query fn contract. */
export type AccountApiBaseQueryFn = BaseQueryFn<void, never, AccountError>;
