import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { AuthBaseQuery } from "@core/auth/gateways/auth-base-query";
import { sleep } from "@core/lib/sleep";

import type {
  AuthContext,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthResult } from "@core/auth/domain/auth-result";

/** Fake auth gateway that adds latency to the in-memory adapter. */
export class FakeAuthBaseQuery extends AuthBaseQuery {
  private readonly inMemoryBaseQuery = new InMemoryAuthBaseQuery();

  /** Retrieves the simulated account. */
  async retrieveAccount(): Promise<AuthResult<Account | null>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.retrieveAccount();
  }

  /** Applies simulated account changes. */
  async updateAccount(
    payload: UpdateAccountPayload,
  ): Promise<AuthResult<Account>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.updateAccount(payload);
  }

  /** Creates a simulated registered session. */
  async register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.register(payload);
  }

  /** Authenticates against the simulated account. */
  async login(payload: LoginPayload): Promise<AuthResult<AuthContext>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.login(payload);
  }

  /** Simulates Google sign-in. */
  async loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.loginWithGoogle();
  }

  /** Simulates Apple sign-in. */
  async loginWithApple(): Promise<AuthResult<AuthContext>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.loginWithApple();
  }

  /** Simulates requesting a password reset. */
  async requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.requestPasswordReset(payload);
  }

  /** Simulates completing a password reset. */
  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthResult<void>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.resetPassword(payload);
  }

  /** Simulates logout. */
  async logout(): Promise<AuthResult<void>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.logout();
  }

  /** Simulates permanent account deletion. */
  async deleteAccount(): Promise<AuthResult<void>> {
    await sleep(3000);
    return this.inMemoryBaseQuery.deleteAccount();
  }
}
