import type { Session } from "@core/auth/domain/auth";

/**
 * Creates fluent session fixtures for domain and use-case behavior specs.
 */
export function sessionBuilder({
  userId = "auth-user-id",
  accessToken = "access-token",
  refreshToken = "refresh-token",
  expiresAt = 1798761600000,
}: Partial<Session> = {}) {
  const props: Session = {
    userId,
    accessToken,
    refreshToken,
    expiresAt,
  };

  return {
    /**
     * Returns a new session builder with the provided owner identifier.
     */
    withUserId(value: Session["userId"]) {
      return sessionBuilder({
        ...props,
        userId: value,
      });
    },

    /**
     * Returns a new session builder with the provided access token.
     */
    withAccessToken(value: Session["accessToken"]) {
      return sessionBuilder({
        ...props,
        accessToken: value,
      });
    },

    /**
     * Returns a new session builder with the provided refresh token.
     */
    withRefreshToken(value: Session["refreshToken"]) {
      return sessionBuilder({
        ...props,
        refreshToken: value,
      });
    },

    /**
     * Returns a new session builder with the provided expiration timestamp.
     */
    withExpiresAt(value: Session["expiresAt"]) {
      return sessionBuilder({
        ...props,
        expiresAt: value,
      });
    },

    /**
     * Builds the session represented by the current builder state.
     */
    build(): Session {
      return {
        userId: props.userId,
        accessToken: props.accessToken,
        refreshToken: props.refreshToken,
        expiresAt: props.expiresAt,
      };
    },
  };
}
