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
