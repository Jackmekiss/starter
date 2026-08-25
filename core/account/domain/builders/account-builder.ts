import type { Account } from "@core/account/domain/account";

/** Performs the account builder operation. */
export function accountBuilder({
  id = "018f0c44-7a57-7a7a-8a5d-6f5f7bb2dc01",
  email = "account@example.test",
  displayName = null,
  onboardingStatus = "completed",
  createdAt = "2026-01-01T00:00:00.000Z",
  updatedAt = "2026-01-01T00:00:00.000Z",
}: Partial<Account> = {}) {
  const props: Account = {
    id,
    email,
    displayName,
    onboardingStatus,
    createdAt,
    updatedAt,
  };

  return {
    withDisplayName(value: Account["displayName"]) {
      return accountBuilder({ ...props, displayName: value });
    },
    withOnboardingStatus(value: Account["onboardingStatus"]) {
      return accountBuilder({ ...props, onboardingStatus: value });
    },
    build(): Account {
      return { ...props };
    },
  };
}
