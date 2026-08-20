import type { AuthError } from "@core/auth/domain/auth-error";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/** Empty RTK Query transport used because auth use-cases call their gateway directly. */
export type AuthApiBaseQueryFn = BaseQueryFn<void, never, AuthError>;
