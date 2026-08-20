import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { AuthGateway } from "@core/auth/gateways/auth-gateway";
import { sleep } from "@core/lib/sleep";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

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
import type { DateProvider } from "@core/shared/gateways/date-provider";

/** Fake auth gateway that adds latency to the in-memory adapter. */
export class FakeAuthGateway extends AuthGateway {
  private readonly inMemoryGateway: InMemoryAuthGateway;

  private currentError?: AuthError;

  /** Configures deterministic latency while keeping production demo defaults. */
  constructor(
    private readonly latencyMilliseconds = 3000,
    dateProvider: DateProvider = new DeterministicDateProvider(),
  ) {
    super();
    this.inMemoryGateway = new InMemoryAuthGateway(dateProvider);
  }

  /** Injects one failure consistently across every fake auth operation. */
  set error(value: AuthError | undefined) {
    this.currentError = value;
  }

  /** Retrieves the simulated account. */
  retrieveAccount(): Promise<AuthResult<Account | null>> {
    return this.executeOperation(() => this.inMemoryGateway.retrieveAccount());
  }

  /** Applies simulated account changes. */
  updateAccount(payload: UpdateAccountPayload): Promise<AuthResult<Account>> {
    return this.executeOperation(() =>
      this.inMemoryGateway.updateAccount(payload),
    );
  }

  /** Creates a simulated registered session. */
  register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => this.inMemoryGateway.register(payload));
  }

  /** Authenticates against the simulated account. */
  login(payload: LoginPayload): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => this.inMemoryGateway.login(payload));
  }

  /** Simulates Google sign-in. */
  loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => this.inMemoryGateway.loginWithGoogle());
  }

  /** Simulates Apple sign-in. */
  loginWithApple(): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => this.inMemoryGateway.loginWithApple());
  }

  /** Simulates requesting a password reset. */
  requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    return this.executeOperation(() =>
      this.inMemoryGateway.requestPasswordReset(payload),
    );
  }

  /** Simulates completing a password reset. */
  resetPassword(payload: ResetPasswordPayload): Promise<AuthResult<void>> {
    return this.executeOperation(() =>
      this.inMemoryGateway.resetPassword(payload),
    );
  }

  /** Simulates logout. */
  logout(): Promise<AuthResult<void>> {
    return this.executeOperation(() => this.inMemoryGateway.logout());
  }

  /** Simulates permanent account deletion. */
  deleteAccount(): Promise<AuthResult<void>> {
    return this.executeOperation(() => this.inMemoryGateway.deleteAccount());
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
