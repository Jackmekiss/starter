import { produce } from "immer";
import type {
  AuthActionResult,
  AuthResult,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
  UpdateAccountPayload,
} from "../../apis/types";
import type { Account } from "../../domain/account";
import type { AuthUser, Session } from "../../domain/auth";
import { AuthBaseQuery } from "../../gateways/auth-base-query";

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

export class InMemoryAuthBaseQuery extends AuthBaseQuery {
  async retrieveAccount(): Promise<Account | null> {
    return account;
  }

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

  async requestPasswordReset(
    _: RequestPasswordResetPayload,
  ): Promise<AuthActionResult> {
    return {
      success: true,
    };
  }

  async resetPassword(_: ResetPasswordPayload): Promise<AuthActionResult> {
    return {
      success: true,
    };
  }

  async logout(): Promise<void> {}

  async deleteAccount(): Promise<void> {
    account = null;
    authUser = null;
  }
}
