/** Authentication session tokens currently accepted by the app runtime. */
export interface Session {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

/** Minimal authenticated identity returned by a login or registration flow. */
export interface AuthUser {
  id: string;
  email: string;
}
