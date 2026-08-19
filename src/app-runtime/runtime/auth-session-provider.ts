import type { Session } from "@core/auth/domain/auth";
import type { AuthSessionProvider } from "@core/auth/gateways/auth-session-provider";

/** Reads the current session from its runtime source of truth. */
type SessionReader = () => Session | null;

/** Returns the unauthenticated state before Redux is connected. */
function readMissingSession(): Session | null {
  return null;
}

let readCurrentSession: SessionReader = readMissingSession;

/** Runtime provider read by authenticated adapters at request time. */
export const authSessionProvider: AuthSessionProvider = {
  getSession() {
    return readCurrentSession();
  },
};

/** Connects the provider to the Redux session without copying its value. */
export function connectAuthSessionProvider(reader: SessionReader): void {
  readCurrentSession = reader;
}
