import { mapAuthAdapterError } from "@core/auth/adapters/errors/auth-error-mapper";
import { AuthGateway } from "@core/auth/gateways/auth-gateway";

import type {
  AuthContext,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
} from "@core/auth/apis/types";
import type { AuthError } from "@core/auth/domain/auth-error";
import type { AuthResult } from "@core/auth/domain/auth-result";
import type { AuthUser, Session } from "@core/auth/domain/auth";

/** Deterministic auth adapter for behavior specs and local development. */
export class InMemoryAuthGateway extends AuthGateway {
  private currentError?: AuthError;

  private currentUser: AuthUser | null = {
    id: "auth-user-id",
    email: "user@example.com",
  };

  private currentSession: Session = {
    userId: "auth-user-id",
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expiresAt: 1_798_761_600_000,
  };

  /** Replaces auth user. */
  set authUser(value: AuthUser | null) {
    this.currentUser = value;
  }

  /** Replaces session. */
  set session(value: Session) {
    this.currentSession = value;
  }

  /** Injects the deterministic error returned by subsequent operations. */
  set error(value: AuthError | undefined) {
    this.currentError = value;
  }

  /** Registers the requested value. */
  register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => {
      this.currentUser = { id: "auth-user-id", email: payload.email };
      this.currentSession = {
        ...this.currentSession,
        userId: this.currentUser.id,
      };

      return {
        ok: true,
        value: { user: this.currentUser, session: this.currentSession },
      };
    });
  }

  /** Authenticates the current user. */
  login(_: LoginPayload): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() =>
      this.currentUser
        ? {
            ok: true,
            value: { user: this.currentUser, session: this.currentSession },
          }
        : {
            ok: false,
            error: {
              kind: "business",
              code: "INVALID_CREDENTIALS",
              retryable: false,
            },
          },
    );
  }

  /** Authenticates the current user. */
  loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    return this.providerUnavailable();
  }

  /** Authenticates the current user. */
  loginWithApple(): Promise<AuthResult<AuthContext>> {
    return this.providerUnavailable();
  }

  /** Requests password reset. */
  requestPasswordReset(
    _: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    return this.executeOperation(() => ({ ok: true, value: undefined }));
  }

  /** Resets password. */
  resetPassword(_: ResetPasswordPayload): Promise<AuthResult<void>> {
    return this.executeOperation(() => ({ ok: true, value: undefined }));
  }

  /** Ends the current authenticated session. */
  logout(): Promise<AuthResult<void>> {
    return this.executeOperation(() => ({ ok: true, value: undefined }));
  }

  /** Removes the deterministic identity used by deletion behavior specs. */
  deleteAccount(): Promise<AuthResult<void>> {
    return this.executeOperation(() => {
      this.currentUser = null;

      return { ok: true, value: undefined };
    });
  }

  /** Performs the provider unavailable operation. */
  private providerUnavailable(): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => ({
      ok: false,
      error: {
        kind: "business",
        code: "PROVIDER_UNAVAILABLE",
        retryable: false,
      },
    }));
  }

  /** Executes one operation through its typed error boundary. */
  private async executeOperation<Value>(
    operation: () => AuthResult<Value> | Promise<AuthResult<Value>>,
  ): Promise<AuthResult<Value>> {
    if (this.currentError) return { ok: false, error: this.currentError };

    try {
      return await operation();
    } catch (error) {
      return { ok: false, error: mapAuthAdapterError(error) };
    }
  }
}
