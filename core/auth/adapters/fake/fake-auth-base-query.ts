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
import type { AuthError } from "@core/auth/domain/auth-error";
import type { AuthResult } from "@core/auth/domain/auth-result";

/** Fake auth gateway that adds latency to the in-memory adapter. */
export class FakeAuthBaseQuery extends AuthBaseQuery {
  private readonly inMemoryBaseQuery = new InMemoryAuthBaseQuery();

  private currentError?: AuthError;

  /** Configures deterministic latency while keeping production demo defaults. */
  constructor(private readonly latencyMilliseconds = 3000) {
    super();
  }

  /** Injects one failure consistently across every fake auth operation. */
  set error(value: AuthError | undefined) {
    this.currentError = value;
  }

  /** Retrieves the simulated account. */
  retrieveAccount(): Promise<AuthResult<Account | null>> {
    return this.executeOperation(() =>
      this.inMemoryBaseQuery.retrieveAccount(),
    );
  }

  /** Applies simulated account changes. */
  updateAccount(payload: UpdateAccountPayload): Promise<AuthResult<Account>> {
    return this.executeOperation(() =>
      this.inMemoryBaseQuery.updateAccount(payload),
    );
  }

  /** Creates a simulated registered session. */
  register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() =>
      this.inMemoryBaseQuery.register(payload),
    );
  }

  /** Authenticates against the simulated account. */
  login(payload: LoginPayload): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => this.inMemoryBaseQuery.login(payload));
  }

  /** Simulates Google sign-in. */
  loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() =>
      this.inMemoryBaseQuery.loginWithGoogle(),
    );
  }

  /** Simulates Apple sign-in. */
  loginWithApple(): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => this.inMemoryBaseQuery.loginWithApple());
  }

  /** Simulates requesting a password reset. */
  requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    return this.executeOperation(() =>
      this.inMemoryBaseQuery.requestPasswordReset(payload),
    );
  }

  /** Simulates completing a password reset. */
  resetPassword(payload: ResetPasswordPayload): Promise<AuthResult<void>> {
    return this.executeOperation(() =>
      this.inMemoryBaseQuery.resetPassword(payload),
    );
  }

  /** Simulates logout. */
  logout(): Promise<AuthResult<void>> {
    return this.executeOperation(() => this.inMemoryBaseQuery.logout());
  }

  /** Simulates permanent account deletion. */
  deleteAccount(): Promise<AuthResult<void>> {
    return this.executeOperation(() => this.inMemoryBaseQuery.deleteAccount());
  }

  /** Applies fake latency and the injected failure before running an operation. */
  private async executeOperation<Value>(
    operation: () => Promise<AuthResult<Value>>,
  ): Promise<AuthResult<Value>> {
    await sleep(this.latencyMilliseconds);

    if (this.currentError) {
      return { ok: false, error: this.currentError };
    }

    return operation();
  }
}
