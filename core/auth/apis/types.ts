import type { AuthUser, Session } from "@core/auth/domain/auth";

/** Credentials required to register an identity. */
export interface RegisterPayload {
  /**
   * Email address used as the account login identifier.
   */
  email: string;

  /**
   * Secret credential submitted to the auth provider during registration.
   */
  password: string;
}

/**
 * Password credentials submitted by the standard login flow.
 */
export interface LoginPayload {
  /**
   * Email address used to identify the existing account.
   */
  email: string;

  /**
   * Secret credential submitted for standard email login.
   */
  password: string;
}

/**
 * Email address that should receive a password reset challenge.
 */
export interface RequestPasswordResetPayload {
  /**
   * Account email that should receive the reset challenge.
   */
  email: string;
}

/**
 * New password plus optional recovery URL returned by the auth provider.
 */
export interface ResetPasswordPayload {
  /**
   * New password to apply during reset completion.
   */
  password: string;

  /**
   * Optional provider recovery URL carrying the reset challenge.
   */
  recoveryUrl?: string;
}

/** Authenticated identity and session returned by identity operations. */
export interface AuthContext {
  /** Authenticated identity resolved by the selected provider. */
  user: AuthUser;
  /** Active session when the provider created one. */
  session: Session | null;
}
