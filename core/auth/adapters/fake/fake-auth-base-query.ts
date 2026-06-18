import { sleep } from "../../../lib/sleep";
import {
  AuthActionResult,
  AuthResult,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "../../apis/types";
import { Account } from "../../domain/account";
import { AuthBaseQuery } from "../../gateways/auth-base-query";
import { InMemoryAuthBaseQuery } from "../in-memory/in-memory-auth-base-query";

export class FakeAuthBaseQuery extends AuthBaseQuery {
  private readonly inMemoryBaseQuery = new InMemoryAuthBaseQuery();

  async retrieveAccount(): Promise<Account | null> {
    await sleep(3000);
    return this.inMemoryBaseQuery.retrieveAccount();
  }

  async updateAccount(payload: UpdateAccountPayload): Promise<Account> {
    await sleep(3000);
    return this.inMemoryBaseQuery.updateAccount(payload);
  }

  async register(payload: RegisterPayload): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.register(payload);
  }

  async login(payload: LoginPayload): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.login(payload);
  }

  async loginWithGoogle(): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.loginWithGoogle();
  }

  async loginWithApple(): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.loginWithApple();
  }

  async requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthActionResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.requestPasswordReset(payload);
  }

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthActionResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.resetPassword(payload);
  }

  async logout(): Promise<void> {
    await sleep(3000);
    return this.inMemoryBaseQuery.logout();
  }

  async deleteAccount(): Promise<void> {
    await sleep(3000);
    return this.inMemoryBaseQuery.deleteAccount();
  }
}
