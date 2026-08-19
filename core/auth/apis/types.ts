import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";

/**
 * Credentials and optional profile data required to create an account.
 */
export interface RegisterPayload {
  /**
   * Email address used as the account login identifier.
   */
  email: string;

  /**
   * Secret credential submitted to the auth provider during registration.
   */
  password: string;

  /**
   * Optional given name used to prefill the account profile.
   */
  firstName?: string;

  /**
   * Optional family name used to prefill the account profile.
   */
  lastName?: string;
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
 * Partial account changes allowed through the account update use-case.
 */
export interface UpdateAccountPayload {
  /**
   * Replacement avatar URI, with null clearing the current avatar.
   */
  avatarUri?: Account["avatarUri"];

  /**
   * Replacement given name for the account profile.
   */
  firstName?: string;

  /**
   * Replacement family name for the account profile.
   */
  lastName?: string;

  /**
   * Explicit onboarding lifecycle override after profile updates.
   */
  onboardingStatus?: Account["onboardingStatus"];
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

/** Authenticated identity, session, and account returned by sign-in actions. */
export interface AuthContext {
  /** Authenticated identity resolved by the selected provider. */
  user: AuthUser;
  /** Active session when the provider created one. */
  session: Session | null;
  /** Account profile associated with the identity when available. */
  account: Account | null;
}
