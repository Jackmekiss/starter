import type { AuthResult } from "@core/auth/domain/auth-result";
import type { Session } from "@core/auth/domain/auth";
import type { SessionStorage } from "@core/auth/gateways/session-storage";

/** Process-memory session storage used by behavior specs and unsupported platforms. */
export class InMemorySessionStorage implements SessionStorage {
  private currentSession: Session | null = null;

  /** Replaces the session fixture returned by the storage adapter. */
  set session(value: Session | null) {
    this.currentSession = value;
  }

  /** Returns the currently stored session fixture. */
  get session(): Session | null {
    return this.currentSession;
  }

  /** Retrieves the current process-memory session. */
  retrieveSession(): Promise<AuthResult<Session | null>> {
    return Promise.resolve({ ok: true, value: this.currentSession });
  }

  /** Persists a session for the current process lifetime. */
  persistSession(session: Session): Promise<AuthResult<void>> {
    this.currentSession = session;
    return Promise.resolve({ ok: true, value: undefined });
  }

  /** Clears the current process-memory session. */
  clearSession(): Promise<AuthResult<void>> {
    this.currentSession = null;
    return Promise.resolve({ ok: true, value: undefined });
  }
}
