import type { Account } from "@core/auth/domain/account";

/**
 * Creates fluent account fixtures for domain and use-case behavior specs.
 */
export function accountBuilder({
  id = "account-id",
  email = "account@example.com",
  avatarUri = null,
  firstName = "Account",
  lastName = "User",
  onboardingStatus = "completed",
  createdAt = "2026-06-17T00:00:00.000Z",
}: Partial<Account> = {}) {
  const props: Account = {
    id,
    email,
    avatarUri,
    firstName,
    lastName,
    onboardingStatus,
    createdAt,
  };

  return {
    /**
     * Returns a new account builder with the provided account identifier.
     */
    withId(value: Account["id"]) {
      return accountBuilder({
        ...props,
        id: value,
      });
    },

    /**
     * Returns a new account builder with the provided email address.
     */
    withEmail(value: Account["email"]) {
      return accountBuilder({
        ...props,
        email: value,
      });
    },

    /**
     * Returns a new account builder with the provided avatar URI.
     */
    withAvatarUri(value: Account["avatarUri"]) {
      return accountBuilder({
        ...props,
        avatarUri: value,
      });
    },

    /**
     * Returns a new account builder with the provided first name.
     */
    withFirstName(value: Account["firstName"]) {
      return accountBuilder({
        ...props,
        firstName: value,
      });
    },

    /**
     * Returns a new account builder with the provided last name.
     */
    withLastName(value: Account["lastName"]) {
      return accountBuilder({
        ...props,
        lastName: value,
      });
    },

    /**
     * Returns a new account builder with the provided onboarding status.
     */
    withOnboardingStatus(value: Account["onboardingStatus"]) {
      return accountBuilder({
        ...props,
        onboardingStatus: value,
      });
    },

    /**
     * Returns a new account builder with the provided creation timestamp.
     */
    withCreatedAt(value: Account["createdAt"]) {
      return accountBuilder({
        ...props,
        createdAt: value,
      });
    },

    /**
     * Builds the account entity represented by the current builder state.
     */
    build(): Account {
      return {
        id: props.id,
        email: props.email,
        avatarUri: props.avatarUri,
        firstName: props.firstName,
        lastName: props.lastName,
        onboardingStatus: props.onboardingStatus,
        createdAt: props.createdAt,
      };
    },
  };
}
