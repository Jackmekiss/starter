import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { AuthGateway } from "@core/auth/gateways/auth-gateway";
import { sleep } from "@core/shared/adapters/time/sleep";

import type {
  AuthContext,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
} from "@core/auth/apis/types";
import type { AuthError } from "@core/auth/domain/auth-error";
import type { AuthResult } from "@core/auth/domain/auth-result";

/** Latency wrapper around the canonical in-memory auth adapter. */
export class FakeAuthGateway extends AuthGateway {
  private readonly delegate = new InMemoryAuthGateway();

  /** Creates the instance with its required dependencies. */
  constructor(private readonly latencyMilliseconds = 3000) {
    super();
  }

  /** Injects the deterministic error returned by subsequent operations. */
  set error(value: AuthError | undefined) {
    this.delegate.error = value;
  }

  /** Registers the requested value. */
  register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    return this.execute(() => this.delegate.register(payload));
  }

  /** Authenticates the current user. */
  login(payload: LoginPayload): Promise<AuthResult<AuthContext>> {
    return this.execute(() => this.delegate.login(payload));
  }

  /** Authenticates the current user. */
  loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    return this.execute(() => this.delegate.loginWithGoogle());
  }

  /** Authenticates the current user. */
  loginWithApple(): Promise<AuthResult<AuthContext>> {
    return this.execute(() => this.delegate.loginWithApple());
  }

  /** Requests password reset. */
  requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    return this.execute(() => this.delegate.requestPasswordReset(payload));
  }

  /** Resets password. */
  resetPassword(payload: ResetPasswordPayload): Promise<AuthResult<void>> {
    return this.execute(() => this.delegate.resetPassword(payload));
  }

  /** Ends the current authenticated session. */
  logout(): Promise<AuthResult<void>> {
    return this.execute(() => this.delegate.logout());
  }

  /** Delegates identity deletion after the configured latency. */
  deleteAccount(): Promise<AuthResult<void>> {
    return this.execute(() => this.delegate.deleteAccount());
  }

  /** Executes one operation through its typed error boundary. */
  private async execute<Value>(
    operation: () => Promise<AuthResult<Value>>,
  ): Promise<AuthResult<Value>> {
    await sleep(this.latencyMilliseconds);
    return operation();
  }
}
