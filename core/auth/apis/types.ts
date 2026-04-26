import { Account } from "../domain/account";
import { AuthUser, Session } from "../domain/auth";

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateAccountPayload {
  avatarUri?: Account["avatarUri"];
  firstName?: string;
  lastName?: string;
  onboardingStatus?: Account["onboardingStatus"];
}

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

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  recoveryUrl?: string;
}

export type AuthActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: AuthError;
    };

export type AuthResult =
  | {
      success: true;
      user: AuthUser;
      session: Session | null;
      account: Account | null;
    }
  | { success: false; error: AuthError };
