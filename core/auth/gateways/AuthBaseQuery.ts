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
      if (url === "/register") {
        return { data: await this.register(body) };
      }

      if (url === "/login") {
        return { data: await this.login(body) };
      }

      if (url === "/retrieve") {
        return { data: await this.retrieveAccount() };
      }

      if (url === "/update") {
        return { data: await this.updateAccount(body) };
      }

      if (url === "/password/request-reset") {
        return { data: await this.requestPasswordReset(body) };
      }

      if (url === "/password/reset") {
        return { data: await this.resetPassword(body) };
      }

      if (url === "/login/google") {
        return { data: await this.loginWithGoogle() };
      }

      if (url === "/login/apple") {
        return { data: await this.loginWithApple() };
      }

      if (url === "/logout") {
        return { data: await this.logout() };
      }

      if (url === "/delete") {
        return { data: await this.deleteAccount() };
      }

      return { data: {} };
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
