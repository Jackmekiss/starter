import type { AuthUser } from "@core/auth/domain/auth";

/**
 * Creates fluent auth user fixtures for domain and use-case behavior specs.
 */
export function authUserBuilder({
  id = "auth-user-id",
  email = "user@example.com",
}: Partial<AuthUser> = {}) {
  const props: AuthUser = {
    id,
    email,
  };

  return {
    /**
     * Returns a new auth user builder with the provided user identifier.
     */
    withId(value: AuthUser["id"]) {
      return authUserBuilder({
        ...props,
        id: value,
      });
    },

    /**
     * Returns a new auth user builder with the provided email address.
     */
    withEmail(value: AuthUser["email"]) {
      return authUserBuilder({
        ...props,
        email: value,
      });
    },

    /**
     * Builds the auth user represented by the current builder state.
     */
    build(): AuthUser {
      return {
        id: props.id,
        email: props.email,
      };
    },
  };
}
