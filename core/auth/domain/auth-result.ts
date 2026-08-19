import type { AuthError } from "@core/auth/domain/auth-error";
import type { Result } from "@core/shared/domain/result";

/** Result returned by an authentication operation. */
export type AuthResult<Value> = Result<Value, AuthError>;
