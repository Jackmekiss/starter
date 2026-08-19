/**
 * Authentication session tokens currently accepted by the app runtime.
 */
export interface Session {
  /**
   * Account identity that owns the current auth tokens.
   */
  userId: string;

  /**
   * Bearer token used for authenticated backend requests.
   */
  accessToken: string;

  /**
   * Optional token used to renew the access token.
   */
  refreshToken?: string;

  /**
   * Epoch timestamp after which the access token should be considered expired.
   */
  expiresAt?: number;
}

/**
 * Minimal authenticated identity returned by a login or registration flow.
 */
export interface AuthUser {
  /**
   * Stable identifier for the authenticated identity.
   */
  id: string;

  /**
   * Email address associated with the authenticated identity.
   */
  email: string;
}

/** Narrows unknown persisted data to a structurally valid auth session. */
export function isSession(value: unknown): value is Session {
  if (!isRecord(value)) return false;

  return (
    typeof value.userId === "string" &&
    typeof value.accessToken === "string" &&
    (value.refreshToken === undefined ||
      typeof value.refreshToken === "string") &&
    (value.expiresAt === undefined || typeof value.expiresAt === "number")
  );
}

/** Narrows an unknown value to a property-addressable record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
