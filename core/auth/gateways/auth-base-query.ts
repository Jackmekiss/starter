import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  AuthActionResult,
  AuthResult,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "../apis/types";
import type { Account } from "../domain/account";

type AuthRequest =
  {
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

/** Gateway contract used by auth endpoints to swap fake, memory, or real adapters. */
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

  abstract retrieveAccount(): Promise<Account | null>;

  abstract updateAccount(payload: UpdateAccountPayload): Promise<Account>;

  abstract register(payload: RegisterPayload): Promise<AuthResult>;

  abstract login(payload: LoginPayload): Promise<AuthResult>;

  abstract loginWithGoogle(): Promise<AuthResult>;

  abstract loginWithApple(): Promise<AuthResult>;

  abstract requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthActionResult>;

  abstract resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthActionResult>;

  abstract logout(): Promise<void>;

  abstract deleteAccount(): Promise<void>;
}
