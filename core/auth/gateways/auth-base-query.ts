import type {
  AuthActionResult,
  AuthResult,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/**
 * Internal request contract accepted by the auth RTK Query adapter.
 */
type AuthRequest = {
  params?: unknown;
} & (
  | { url: "/register"; method: "POST"; body: RegisterPayload }
  | { url: "/login"; method: "POST"; body: LoginPayload }
  | { url: "/retrieve"; method: "GET"; body?: undefined }
  | { url: "/update"; method: "POST"; body: UpdateAccountPayload }
  | {
      url: "/password/request-reset";
      method: "POST";
      body: RequestPasswordResetPayload;
    }
  | { url: "/password/reset"; method: "POST"; body: ResetPasswordPayload }
  | { url: "/login/google"; method: "POST"; body?: undefined }
  | { url: "/login/apple"; method: "POST"; body?: undefined }
  | { url: "/logout"; method: "POST"; body?: undefined }
  | { url: "/delete"; method: "POST"; body?: undefined }
);

/**
 * Gateway contract used by auth endpoints to swap fake, memory, or real adapters.
 */
export abstract class AuthBaseQuery {
  public handle = (): BaseQueryFn<AuthRequest> => async (request) => {
    switch (request.url) {
      case "/register":
        return { data: await this.register(request.body) };

      case "/login":
        return { data: await this.login(request.body) };

      case "/retrieve":
        return { data: await this.retrieveAccount() };

      case "/update":
        return { data: await this.updateAccount(request.body) };

      case "/password/request-reset":
        return { data: await this.requestPasswordReset(request.body) };

      case "/password/reset":
        return { data: await this.resetPassword(request.body) };

      case "/login/google":
        return { data: await this.loginWithGoogle() };

      case "/login/apple":
        return { data: await this.loginWithApple() };

      case "/logout":
        return { data: await this.logout() };

      case "/delete":
        return { data: await this.deleteAccount() };
      default:
        return { data: {} };
    }
  };

  /**
   * Retrieves the account profile attached to the current auth session.
   */
  abstract retrieveAccount(): Promise<Account | null>;

  /**
   * Persists editable account profile fields for the current user.
   */
  abstract updateAccount(payload: UpdateAccountPayload): Promise<Account>;

  /**
   * Creates an auth user, account profile, and authenticated session.
   */
  abstract register(payload: RegisterPayload): Promise<AuthResult>;

  /**
   * Authenticates an existing user from email credentials.
   */
  abstract login(payload: LoginPayload): Promise<AuthResult>;

  /**
   * Authenticates or provisions a user through the Google identity provider.
   */
  abstract loginWithGoogle(): Promise<AuthResult>;

  /**
   * Authenticates or provisions a user through the Apple identity provider.
   */
  abstract loginWithApple(): Promise<AuthResult>;

  /**
   * Starts the password reset flow for the requested account email.
   */
  abstract requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthActionResult>;

  /**
   * Completes the password reset flow with the submitted reset credentials.
   */
  abstract resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthActionResult>;

  /**
   * Ends the current authenticated session.
   */
  abstract logout(): Promise<void>;

  /**
   * Permanently removes the current account and related auth state.
   */
  abstract deleteAccount(): Promise<void>;
}
