import { BaseQueryFn } from "@reduxjs/toolkit/query";
import {
  AuthActionResult,
  AuthResult,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "../apis/types";
import { Account } from "../domain/account";

export abstract class AuthBaseQuery {
  public handle =
    (): BaseQueryFn<{
      url: string;
      method: "GET" | "POST";
      body: any;
      params: any;
    }> =>
    async ({ url, body }) => {
      switch (url) {
        case "/register":
          return { data: await this.register(body) };

        case "/login":
          return { data: await this.login(body) };

        case "/retrieve":
          return { data: await this.retrieveAccount() };

        case "/update":
          return { data: await this.updateAccount(body) };

        case "/password/request-reset":
          return { data: await this.requestPasswordReset(body) };

        case "/password/reset":
          return { data: await this.resetPassword(body) };

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
