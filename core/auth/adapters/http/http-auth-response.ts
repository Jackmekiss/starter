import type { AuthContext } from "@core/auth/apis/types";
import type { Account, OnboardingStatus } from "@core/auth/domain/account";
import type { AuthResult } from "@core/auth/domain/auth-result";
import type { AuthUser, Session } from "@core/auth/domain/auth";

/** Decodes an authenticated context returned by the sample HTTP contract. */
export function decodeHttpAuthContext(value: unknown): AuthResult<AuthContext> {
  if (!isRecord(value)) return unexpectedResponse();

  const user = readAuthUser(value.user);
  const session = value.session === null ? null : readSession(value.session);
  const account = value.account === null ? null : readAccount(value.account);

  if (!user || session === undefined || account === undefined) {
    return unexpectedResponse();
  }

  return { ok: true, value: { user, session, account } };
}

/** Decodes a nullable account returned by the sample HTTP contract. */
export function decodeHttpAccount(value: unknown): AuthResult<Account | null> {
  if (value === null) return { ok: true, value: null };

  const account = readAccount(value);
  return account ? { ok: true, value: account } : unexpectedResponse();
}

/** Decodes the account required after a successful profile update. */
export function decodeRequiredHttpAccount(value: unknown): AuthResult<Account> {
  const account = readAccount(value);
  return account ? { ok: true, value: account } : unexpectedResponse();
}

/** Accepts a successful response for an operation without response data. */
export function decodeHttpVoid(_: unknown): AuthResult<void> {
  return { ok: true, value: undefined };
}

/** Reads a validated account from an external response. */
function readAccount(value: unknown): Account | undefined {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.email !== "string" ||
    typeof value.createdAt !== "string" ||
    !isOptionalNullableString(value.avatarUri) ||
    !isOptionalString(value.firstName) ||
    !isOptionalString(value.lastName) ||
    !isOptionalOnboardingStatus(value.onboardingStatus)
  ) {
    return undefined;
  }

  return {
    id: value.id,
    email: value.email,
    createdAt: value.createdAt,
    ...(value.avatarUri !== undefined ? { avatarUri: value.avatarUri } : {}),
    ...(value.firstName !== undefined ? { firstName: value.firstName } : {}),
    ...(value.lastName !== undefined ? { lastName: value.lastName } : {}),
    ...(value.onboardingStatus !== undefined
      ? { onboardingStatus: value.onboardingStatus }
      : {}),
  };
}

/** Reads a validated authenticated identity from an external response. */
function readAuthUser(value: unknown): AuthUser | undefined {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.email !== "string"
  ) {
    return undefined;
  }

  return { id: value.id, email: value.email };
}

/** Reads validated bearer credentials from an external response. */
function readSession(value: unknown): Session | undefined {
  if (
    !isRecord(value) ||
    typeof value.userId !== "string" ||
    typeof value.accessToken !== "string" ||
    !isOptionalString(value.refreshToken) ||
    !isOptionalNumber(value.expiresAt)
  ) {
    return undefined;
  }

  return {
    userId: value.userId,
    accessToken: value.accessToken,
    ...(value.refreshToken !== undefined
      ? { refreshToken: value.refreshToken }
      : {}),
    ...(value.expiresAt !== undefined ? { expiresAt: value.expiresAt } : {}),
  };
}

/** Builds the safe failure used for malformed successful responses. */
function unexpectedResponse(): AuthResult<never> {
  return {
    ok: false,
    error: { kind: "unexpected", retryable: false },
  };
}

/** Checks optional external strings. */
function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

/** Checks optional nullable external strings. */
function isOptionalNullableString(
  value: unknown,
): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

/** Checks optional external numbers. */
function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || typeof value === "number";
}

/** Checks onboarding values accepted by the auth domain. */
function isOptionalOnboardingStatus(
  value: unknown,
): value is OnboardingStatus | undefined {
  return (
    value === undefined ||
    value === "pending" ||
    value === "in-progress" ||
    value === "completed"
  );
}

/** Narrows external JSON values before reading response fields. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
