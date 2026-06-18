import type { Account } from "../domain/account";
import type { AuthUser, Session } from "../domain/auth";

/** Credentials and optional profile data required to create an account. */
export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/** Password credentials submitted by the standard login flow. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Partial account changes allowed through the account update use-case. */
export interface UpdateAccountPayload {
  avatarUri?: Account["avatarUri"];
  firstName?: string;
  lastName?: string;
  onboardingStatus?: Account["onboardingStatus"];
}

/** User-facing authentication failure with a stable machine-readable code. */
export interface AuthError {
  code:
    | "INVALID_CREDENTIALS"
    | "EMAIL_TAKEN"
    | "EMAIL_NOT_CONFIRMED"
    | "WEAK_PASSWORD"
    | "PASSWORD_RESET_INVALID"
    | "PASSWORD_RESET_EXPIRED"
    | "OAUTH_CANCELLED"
    | "PROVIDER_UNAVAILABLE"
    | "NETWORK"
    | "UNKNOWN";
  message: string;
}

/** Email address that should receive a password reset challenge. */
export interface RequestPasswordResetPayload {
  email: string;
}

/** New password plus optional recovery URL returned by the auth provider. */
export interface ResetPasswordPayload {
  password: string;
  recoveryUrl?: string;
}

/** Result for auth actions that do not create a session. */
export type AuthActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: AuthError;
    };

/** Result for auth actions that can establish a session and account context. */
export type AuthResult =
  | {
      success: true;
      user: AuthUser;
      session: Session | null;
      account: Account | null;
    }
  | { success: false; error: AuthError };
