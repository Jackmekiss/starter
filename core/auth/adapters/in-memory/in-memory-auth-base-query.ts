import { produce } from "immer";

import { AuthBaseQuery } from "@core/auth/gateways/auth-base-query";

import type {
  AuthActionResult,
  AuthResult,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";

/**
 * Preserves the current onboarding status unless an account update changes it.
 */
function resolveNextOnboardingStatus(
  currentStatus: Account["onboardingStatus"],
  payload: UpdateAccountPayload,
) {
  if (payload.onboardingStatus !== undefined) {
    return payload.onboardingStatus;
  }

  return currentStatus;
}

let account: Account | null = {
  id: "1",
  email: "test@test.com",
  avatarUri: null,
  firstName: "John",
  lastName: "Doe",
  onboardingStatus: "completed",
  createdAt: new Date().toISOString(),
};

let authUser: AuthUser | null = {
  id: "1",
  email: "test@test.com",
};

const session: Session = {
  userId: "1",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
};

/**
 * In-memory auth gateway used by local development and starter flows.
 */
export class InMemoryAuthBaseQuery extends AuthBaseQuery {
  /**
   * Returns the current local account snapshot without network persistence.
   */
  async retrieveAccount(): Promise<Account | null> {
    return account;
  }

  /**
   * Mutates the local account snapshot with editable profile fields.
   */
  async updateAccount(payload: UpdateAccountPayload): Promise<Account> {
    if (!account) {
      throw new Error("Account not found.");
    }

    account = produce(account, (draft) => {
      if (payload.avatarUri !== undefined) draft.avatarUri = payload.avatarUri;
      if (payload.firstName !== undefined) draft.firstName = payload.firstName;
      if (payload.lastName !== undefined) draft.lastName = payload.lastName;

      draft.onboardingStatus = resolveNextOnboardingStatus(
        draft.onboardingStatus,
        payload,
      );
    });

    return account;
  }

  /**
   * Replaces the local auth state with a newly registered starter account.
   */
  async register(payload: RegisterPayload): Promise<AuthResult> {
    account = {
      id: "1",
      email: payload.email,
      avatarUri: null,
      firstName: payload.firstName,
      lastName: payload.lastName,
      onboardingStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    authUser = {
      id: "1",
      email: payload.email,
    };

    return {
      success: true,
      user: authUser,
      session,
      account,
    };
  }

  /**
   * Resolves the local auth session when the memory store still has a user.
   */
  async login(_: LoginPayload): Promise<AuthResult> {
    if (!authUser || !account) {
      return {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Account not found.",
        },
      };
    }

    return {
      success: true,
      user: authUser,
      session,
      account,
    };
  }

  /**
   * Reuses the stored local user to mimic a successful Google sign-in.
   */
  async loginWithGoogle(): Promise<AuthResult> {
    if (!authUser) {
      return this.login({
        email: "",
        password: "password",
      });
    }

    return this.login({
      email: authUser.email,
      password: "password",
    });
  }

  /**
   * Reuses the stored local user to mimic a successful Apple sign-in.
   */
  async loginWithApple(): Promise<AuthResult> {
    if (!authUser) {
      return this.login({
        email: "",
        password: "password",
      });
    }

    return this.login({
      email: authUser.email,
      password: "password",
    });
  }

  /**
   * Acknowledges password reset requests without sending external email.
   */
  async requestPasswordReset(
    _: RequestPasswordResetPayload,
  ): Promise<AuthActionResult> {
    return {
      success: true,
    };
  }

  /**
   * Acknowledges password reset completion without changing local credentials.
   */
  async resetPassword(_: ResetPasswordPayload): Promise<AuthActionResult> {
    return {
      success: true,
    };
  }

  /**
   * Keeps local auth data intact because starter logout has no persisted session.
   */
  async logout(): Promise<void> {}

  /**
   * Clears the local account and auth user to mimic permanent account removal.
   */
  async deleteAccount(): Promise<void> {
    account = null;
    authUser = null;
  }
}
