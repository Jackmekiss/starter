import type {
  AuthContext,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthError } from "@core/auth/domain/auth-error";
import type { AuthResult } from "@core/auth/domain/auth-result";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/** Internal request contract accepted by auth RTK Query endpoints. */
export type AuthRequest =
  | { url: "/register"; method: "POST"; body: RegisterPayload }
  | { url: "/login"; method: "POST"; body: LoginPayload }
  | { url: "/retrieve"; method: "GET" }
  | { url: "/update"; method: "POST"; body: UpdateAccountPayload }
  | {
      url: "/password/request-reset";
      method: "POST";
      body: RequestPasswordResetPayload;
    }
  | { url: "/password/reset"; method: "POST"; body: ResetPasswordPayload }
  | { url: "/login/google"; method: "POST" }
  | { url: "/login/apple"; method: "POST" }
  | { url: "/logout"; method: "POST" }
  | { url: "/delete"; method: "POST" };

/** Typed base-query contract shared by auth use-cases. */
export type AuthBaseQueryFn = BaseQueryFn<AuthRequest, unknown, AuthError>;

/** Gateway contract used by auth endpoints to swap data-source adapters. */
export abstract class AuthBaseQuery {
  /** Converts typed adapter results into RTK Query data or error channels. */
  handle(): AuthBaseQueryFn {
    return async (request) => {
      const result = await this.routeRequest(request);
      if (!result.ok) return { error: result.error };
      return { data: result.value };
    };
  }

  /** Routes one internal request to its domain-oriented operation. */
  private routeRequest(request: AuthRequest): Promise<AuthResult<unknown>> {
    switch (request.url) {
      case "/register":
        return this.register(request.body);
      case "/login":
        return this.login(request.body);
      case "/retrieve":
        return this.retrieveAccount();
      case "/update":
        return this.updateAccount(request.body);
      case "/password/request-reset":
        return this.requestPasswordReset(request.body);
      case "/password/reset":
        return this.resetPassword(request.body);
      case "/login/google":
        return this.loginWithGoogle();
      case "/login/apple":
        return this.loginWithApple();
      case "/logout":
        return this.logout();
      case "/delete":
        return this.deleteAccount();
      default:
        return Promise.resolve({
          ok: false,
          error: { kind: "unexpected", retryable: false },
        });
    }
  }

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
