import * as SecureStore from "expo-secure-store";

import { mapAuthAdapterError } from "@core/auth/adapters/errors/auth-error-mapper";
import { isSession } from "@core/auth/domain/auth";

import type { AuthResult } from "@core/auth/domain/auth-result";
import type { Session } from "@core/auth/domain/auth";
import type { SessionStorage } from "@core/auth/gateways/session-storage";

const AUTH_SESSION_STORAGE_KEY = "auth.session";

/** SecureStore-backed authentication-session persistence for native platforms. */
export class SecureSessionStorage implements SessionStorage {
  private volatileSession: Session | null = null;

  /** Retrieves and validates the securely persisted authentication session. */
  async retrieveSession(): Promise<AuthResult<Session | null>> {
    try {
      if (!(await SecureStore.isAvailableAsync())) {
        return { ok: true, value: this.volatileSession };
      }

      const serializedSession = await SecureStore.getItemAsync(
        AUTH_SESSION_STORAGE_KEY,
      );
      if (!serializedSession) return { ok: true, value: null };

      const session: unknown = JSON.parse(serializedSession);
      if (!isSession(session) || this.isExpired(session)) {
        await SecureStore.deleteItemAsync(AUTH_SESSION_STORAGE_KEY);
        return { ok: true, value: null };
      }

      return { ok: true, value: session };
    } catch (error) {
      return { ok: false, error: mapAuthAdapterError(error) };
    }
  }

  /** Persists authentication credentials with the native secure storage API. */
  async persistSession(session: Session): Promise<AuthResult<void>> {
    try {
      if (!(await SecureStore.isAvailableAsync())) {
        this.volatileSession = session;
        return { ok: true, value: undefined };
      }

      await SecureStore.setItemAsync(
        AUTH_SESSION_STORAGE_KEY,
        JSON.stringify(session),
      );
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: mapAuthAdapterError(error) };
    }
  }

  /** Removes credentials from both secure and process-memory storage. */
  async clearSession(): Promise<AuthResult<void>> {
    try {
      this.volatileSession = null;
      if (await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync(AUTH_SESSION_STORAGE_KEY);
      }
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: mapAuthAdapterError(error) };
    }
  }

  /** Reports whether a session has passed its optional expiration timestamp. */
  private isExpired(session: Session): boolean {
    return session.expiresAt !== undefined && session.expiresAt <= Date.now();
  }
}
