import type { Session } from "@core/auth/domain/auth";

/** Read-only access to the current runtime session for authenticated adapters. */
export interface AuthSessionProvider {
  /** Returns the latest session owned by application state. */
  getSession(): Session | null;
}
