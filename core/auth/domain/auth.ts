export interface Session {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthUser {
  id: string;
  email: string;
}
