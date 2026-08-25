import type {
  AuthContext,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
} from "@core/auth/apis/types";
import type { AuthResult } from "@core/auth/domain/auth-result";

/** Domain-oriented authentication operations implemented by replaceable adapters. */
export abstract class AuthGateway {
  /** Creates an auth user and authenticated session. */
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
