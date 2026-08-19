import type { AuthResult } from "@core/auth/domain/auth-result";
import type { Session } from "@core/auth/domain/auth";

/** Durable storage boundary for the current authentication session. */
export interface SessionStorage {
  /** Retrieves the session saved for the next application launch. */
  retrieveSession(): Promise<AuthResult<Session | null>>;

  /** Persists the session returned by a successful authentication action. */
  persistSession(session: Session): Promise<AuthResult<void>>;

  /** Removes every locally persisted authentication credential. */
  clearSession(): Promise<AuthResult<void>>;
}
