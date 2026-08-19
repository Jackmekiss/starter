import { produce } from "immer";

import { mapAuthAdapterError } from "@core/auth/adapters/errors/auth-error-mapper";
import { AuthBaseQuery } from "@core/auth/gateways/auth-base-query";

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
import type { AuthUser, Session } from "@core/auth/domain/auth";

/** Preserves onboarding status unless an account update changes it. */
function resolveNextOnboardingStatus(
  currentStatus: Account["onboardingStatus"],
  payload: UpdateAccountPayload,
) {
  return payload.onboardingStatus ?? currentStatus;
}

/** In-memory auth gateway used by local development and starter flows. */
export class InMemoryAuthBaseQuery extends AuthBaseQuery {
  private currentError?: AuthError;

  private currentAccount: Account | null = {
    id: "1",
    email: "test@test.com",
    avatarUri: null,
    firstName: "John",
    lastName: "Doe",
    onboardingStatus: "completed",
    createdAt: new Date().toISOString(),
  };

  private currentAuthUser: AuthUser | null = {
    id: "1",
    email: "test@test.com",
  };

  private currentSession: Session = {
    userId: "1",
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
  };

  /** Replaces the account fixture used by the adapter. */
  set account(value: Account | null) {
    this.currentAccount = value;
  }

  /** Replaces the auth-user fixture used by the adapter. */
  set authUser(value: AuthUser | null) {
    this.currentAuthUser = value;
  }

  /** Replaces the session fixture used by the adapter. */
  set session(value: Session) {
    this.currentSession = value;
  }

  /** Sets a deterministic adapter failure for use-case behavior specs. */
  set error(value: AuthError | undefined) {
    this.currentError = value;
  }

  /** Returns the current local account. */
  retrieveAccount(): Promise<AuthResult<Account | null>> {
    return this.executeOperation(() => this.currentAccount);
  }

  /** Updates the current local account. */
  updateAccount(payload: UpdateAccountPayload): Promise<AuthResult<Account>> {
    const { currentAccount } = this;
    if (!currentAccount) {
      return Promise.resolve({
        ok: false,
        error: {
          kind: "not-found",
          code: "ACCOUNT_NOT_FOUND",
          retryable: false,
        },
      });
    }

    return this.executeOperation(() => {
      this.currentAccount = produce(currentAccount, (draft) => {
        if (payload.avatarUri !== undefined)
          draft.avatarUri = payload.avatarUri;
        if (payload.firstName !== undefined)
          draft.firstName = payload.firstName;
        if (payload.lastName !== undefined) draft.lastName = payload.lastName;
        draft.onboardingStatus = resolveNextOnboardingStatus(
          draft.onboardingStatus,
          payload,
        );
      });

      return this.currentAccount;
    });
  }

  /** Replaces local auth state with a registered account. */
  register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    return this.executeOperation(() => {
      this.currentAccount = {
        id: "1",
        email: payload.email,
        avatarUri: null,
        firstName: payload.firstName,
        lastName: payload.lastName,
        onboardingStatus: "pending",
        createdAt: new Date().toISOString(),
      };
      this.currentAuthUser = { id: "1", email: payload.email };

      return this.createAuthContext(this.currentAuthUser, this.currentAccount);
    });
  }

  /** Resolves the local auth session when a user and account exist. */
  login(_: LoginPayload): Promise<AuthResult<AuthContext>> {
    if (!this.currentAuthUser || !this.currentAccount) {
      return Promise.resolve({
        ok: false,
        error: {
          kind: "business",
          code: "INVALID_CREDENTIALS",
          retryable: false,
        },
      });
    }

    return Promise.resolve({
      ok: true,
      value: this.createAuthContext(this.currentAuthUser, this.currentAccount),
    });
  }

  /** Reuses the local user to mimic Google sign-in. */
  loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    return this.login({
      email: this.currentAuthUser?.email ?? "",
      password: "",
    });
  }

  /** Reuses the local user to mimic Apple sign-in. */
  loginWithApple(): Promise<AuthResult<AuthContext>> {
    return this.login({
      email: this.currentAuthUser?.email ?? "",
      password: "",
    });
  }

  /** Acknowledges a password-reset request. */
  requestPasswordReset(
    _: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    return Promise.resolve({ ok: true, value: undefined });
  }

  /** Acknowledges password-reset completion. */
  resetPassword(_: ResetPasswordPayload): Promise<AuthResult<void>> {
    return Promise.resolve({ ok: true, value: undefined });
  }

  /** Completes local logout without deleting fixtures. */
  logout(): Promise<AuthResult<void>> {
    return Promise.resolve({ ok: true, value: undefined });
  }

  /** Clears the local account and identity. */
  deleteAccount(): Promise<AuthResult<void>> {
    return this.executeOperation(() => {
      this.currentAccount = null;
      this.currentAuthUser = null;
    });
  }

  /** Creates the authenticated context returned by sign-in operations. */
  private createAuthContext(user: AuthUser, account: Account): AuthContext {
    return { user, session: this.currentSession, account };
  }

  /** Executes a local operation without leaking implementation failures. */
  private async executeOperation<Value>(
    operation: () => Value | Promise<Value>,
  ): Promise<AuthResult<Value>> {
    if (this.currentError) return { ok: false, error: this.currentError };

    try {
      return { ok: true, value: await operation() };
    } catch (error) {
      return { ok: false, error: mapAuthAdapterError(error) };
    }
  }
}
