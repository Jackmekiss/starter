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

/**
 * In-memory auth gateway used by local development and starter flows.
 */
export class InMemoryAuthBaseQuery extends AuthBaseQuery {
  /**
   * Backing account snapshot returned by account-related use-cases.
   */
  private currentAccount: Account | null = {
    id: "1",
    email: "test@test.com",
    avatarUri: null,
    firstName: "John",
    lastName: "Doe",
    onboardingStatus: "completed",
    createdAt: new Date().toISOString(),
  };

  /**
   * Backing authenticated identity returned by login use-cases.
   */
  private currentAuthUser: AuthUser | null = {
    id: "1",
    email: "test@test.com",
  };

  /**
   * Backing session snapshot returned by successful auth use-cases.
   */
  private currentSession: Session = {
    userId: "1",
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
  };

  /**
   * Replaces the account fixture used by the in-memory adapter.
   */
  set account(value: Account | null) {
    this.currentAccount = value;
  }

  /**
   * Replaces the auth user fixture used by the in-memory adapter.
   */
  set authUser(value: AuthUser | null) {
    this.currentAuthUser = value;
  }

  /**
   * Replaces the session fixture used by the in-memory adapter.
   */
  set session(value: Session) {
    this.currentSession = value;
  }

  /**
   * Returns the current local account snapshot without network persistence.
   */
  async retrieveAccount(): Promise<Account | null> {
    return this.currentAccount;
  }

  /**
   * Mutates the local account snapshot with editable profile fields.
   */
  async updateAccount(payload: UpdateAccountPayload): Promise<Account> {
    if (!this.currentAccount) {
      throw new Error("Account not found.");
    }

    this.currentAccount = produce(this.currentAccount, (draft) => {
      if (payload.avatarUri !== undefined) draft.avatarUri = payload.avatarUri;
      if (payload.firstName !== undefined) draft.firstName = payload.firstName;
      if (payload.lastName !== undefined) draft.lastName = payload.lastName;

      draft.onboardingStatus = resolveNextOnboardingStatus(
        draft.onboardingStatus,
        payload,
      );
    });

    return this.currentAccount;
  }

  /**
   * Replaces the local auth state with a newly registered starter account.
   */
  async register(payload: RegisterPayload): Promise<AuthResult> {
    this.currentAccount = {
      id: "1",
      email: payload.email,
      avatarUri: null,
      firstName: payload.firstName,
      lastName: payload.lastName,
      onboardingStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    this.currentAuthUser = {
      id: "1",
      email: payload.email,
    };

    return {
      success: true,
      user: this.currentAuthUser,
      session: this.currentSession,
      account: this.currentAccount,
    };
  }

  /**
   * Resolves the local auth session when the memory store still has a user.
   */
  async login(_: LoginPayload): Promise<AuthResult> {
    if (!this.currentAuthUser || !this.currentAccount) {
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
      user: this.currentAuthUser,
      session: this.currentSession,
      account: this.currentAccount,
    };
  }

  /**
   * Reuses the stored local user to mimic a successful Google sign-in.
   */
  async loginWithGoogle(): Promise<AuthResult> {
    if (!this.currentAuthUser) {
      return this.login({
        email: "",
        password: "password",
      });
    }

    return this.login({
      email: this.currentAuthUser.email,
      password: "password",
    });
  }

  /**
   * Reuses the stored local user to mimic a successful Apple sign-in.
   */
  async loginWithApple(): Promise<AuthResult> {
    if (!this.currentAuthUser) {
      return this.login({
        email: "",
        password: "password",
      });
    }

    return this.login({
      email: this.currentAuthUser.email,
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
    this.currentAccount = null;
    this.currentAuthUser = null;
  }
}
