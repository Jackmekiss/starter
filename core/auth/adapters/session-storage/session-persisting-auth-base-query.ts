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
import type { AuthResult } from "@core/auth/domain/auth-result";
import type { SessionStorage } from "@core/auth/gateways/session-storage";

/** Decorates an auth gateway with secure session persistence side effects. */
export class SessionPersistingAuthBaseQuery extends AuthBaseQuery {
  /** Creates a session-persisting wrapper around a replaceable auth gateway. */
  constructor(
    private readonly authBaseQuery: AuthBaseQuery,
    private readonly sessionStorage: SessionStorage,
  ) {
    super();
  }

  /** Retrieves the account through the wrapped auth gateway. */
  retrieveAccount(): Promise<AuthResult<Account | null>> {
    return this.authBaseQuery.retrieveAccount();
  }

  /** Updates the account through the wrapped auth gateway. */
  updateAccount(payload: UpdateAccountPayload): Promise<AuthResult<Account>> {
    return this.authBaseQuery.updateAccount(payload);
  }

  /** Registers an account and securely persists its returned session. */
  async register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    return this.persistAuthContext(await this.authBaseQuery.register(payload));
  }

  /** Logs in with credentials and securely persists the returned session. */
  async login(payload: LoginPayload): Promise<AuthResult<AuthContext>> {
    return this.persistAuthContext(await this.authBaseQuery.login(payload));
  }

  /** Logs in with Google and securely persists the returned session. */
  async loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    return this.persistAuthContext(await this.authBaseQuery.loginWithGoogle());
  }

  /** Logs in with Apple and securely persists the returned session. */
  async loginWithApple(): Promise<AuthResult<AuthContext>> {
    return this.persistAuthContext(await this.authBaseQuery.loginWithApple());
  }

  /** Requests a password reset through the wrapped auth gateway. */
  requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    return this.authBaseQuery.requestPasswordReset(payload);
  }

  /** Completes a password reset through the wrapped auth gateway. */
  resetPassword(payload: ResetPasswordPayload): Promise<AuthResult<void>> {
    return this.authBaseQuery.resetPassword(payload);
  }

  /** Logs out remotely before deleting the locally persisted session. */
  async logout(): Promise<AuthResult<void>> {
    const result = await this.authBaseQuery.logout();
    if (!result.ok) return result;
    return this.sessionStorage.clearSession();
  }

  /** Deletes the account remotely before deleting the persisted session. */
  async deleteAccount(): Promise<AuthResult<void>> {
    const result = await this.authBaseQuery.deleteAccount();
    if (!result.ok) return result;
    return this.sessionStorage.clearSession();
  }

  /** Persists or clears the session returned by an authentication action. */
  private async persistAuthContext(
    result: AuthResult<AuthContext>,
  ): Promise<AuthResult<AuthContext>> {
    if (!result.ok) return result;

    const persistenceResult = result.value.session
      ? await this.sessionStorage.persistSession(result.value.session)
      : await this.sessionStorage.clearSession();

    if (!persistenceResult.ok) {
      return { ok: false, error: persistenceResult.error };
    }

    return result;
  }
}
