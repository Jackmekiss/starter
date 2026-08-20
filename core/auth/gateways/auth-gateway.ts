import type {
  AuthContext,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthResult } from "@core/auth/domain/auth-result";

/** Domain-oriented authentication operations implemented by replaceable adapters. */
export abstract class AuthGateway {
  /** Retrieves the account attached to the current auth session. */
  abstract retrieveAccount(): Promise<AuthResult<Account | null>>;

  /** Persists editable account profile fields for the current user. */
  abstract updateAccount(
    payload: UpdateAccountPayload,
  ): Promise<AuthResult<Account>>;

  /** Creates an auth user, account profile, and authenticated session. */
  abstract register(payload: RegisterPayload): Promise<AuthResult<AuthContext>>;

  /** Authenticates an existing user from email credentials. */
  abstract login(payload: LoginPayload): Promise<AuthResult<AuthContext>>;

  /** Authenticates or provisions through Google. */
  abstract loginWithGoogle(): Promise<AuthResult<AuthContext>>;

  /** Authenticates or provisions through Apple. */
  abstract loginWithApple(): Promise<AuthResult<AuthContext>>;

  /** Starts the password reset flow. */
  abstract requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>>;

  /** Completes the password reset flow. */
  abstract resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthResult<void>>;

  /** Ends the current authenticated session. */
  abstract logout(): Promise<AuthResult<void>>;

  /** Permanently removes the current account. */
  abstract deleteAccount(): Promise<AuthResult<void>>;
}
