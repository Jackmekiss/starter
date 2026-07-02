import { sleep } from "@core/lib/sleep";
import { AuthBaseQuery } from "@core/auth/gateways/auth-base-query";
import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";

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

/**
 * Fake auth gateway that simulates network latency on top of memory data.
 */
export class FakeAuthBaseQuery extends AuthBaseQuery {
  private readonly inMemoryBaseQuery = new InMemoryAuthBaseQuery();

  /**
   * Retrieves the simulated account after the fake network delay.
   */
  async retrieveAccount(): Promise<Account | null> {
    await sleep(3000);
    return this.inMemoryBaseQuery.retrieveAccount();
  }

  /**
   * Applies account profile changes through the delayed in-memory adapter.
   */
  async updateAccount(payload: UpdateAccountPayload): Promise<Account> {
    await sleep(3000);
    return this.inMemoryBaseQuery.updateAccount(payload);
  }

  /**
   * Creates a simulated auth session after the fake registration delay.
   */
  async register(payload: RegisterPayload): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.register(payload);
  }

  /**
   * Authenticates against the simulated account after the fake login delay.
   */
  async login(payload: LoginPayload): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.login(payload);
  }

  /**
   * Simulates the Google sign-in round trip before resolving auth state.
   */
  async loginWithGoogle(): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.loginWithGoogle();
  }

  /**
   * Simulates the Apple sign-in round trip before resolving auth state.
   */
  async loginWithApple(): Promise<AuthResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.loginWithApple();
  }

  /**
   * Simulates submitting a password reset request over the network.
   */
  async requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthActionResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.requestPasswordReset(payload);
  }

  /**
   * Simulates completing a password reset over the network.
   */
  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthActionResult> {
    await sleep(3000);
    return this.inMemoryBaseQuery.resetPassword(payload);
  }

  /**
   * Simulates the logout request while leaving memory cleanup to the backing adapter.
   */
  async logout(): Promise<void> {
    await sleep(3000);
    return this.inMemoryBaseQuery.logout();
  }

  /**
   * Simulates account deletion while delegating state removal to the backing adapter.
   */
  async deleteAccount(): Promise<void> {
    await sleep(3000);
    return this.inMemoryBaseQuery.deleteAccount();
  }
}
