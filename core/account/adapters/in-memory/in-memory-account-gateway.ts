import { mapAccountAdapterError } from "@core/account/adapters/errors/account-error-mapper";
import { accountBuilder } from "@core/account/domain/builders/account-builder";
import { AccountGateway } from "@core/account/gateways/account-gateway";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";

import type { UpdateAccountPayload } from "@core/account/apis/types";
import type { Account } from "@core/account/domain/account";
import type { AccountError } from "@core/account/domain/account-error";
import type { AccountResult } from "@core/account/domain/account-result";
import type { DateProvider } from "@core/shared/gateways/date-provider";

export class InMemoryAccountGateway extends AccountGateway {
  private currentAccount: Account | null = null;

  private currentError?: AccountError;

  /** Creates the adapter around a deterministic clock. */
  constructor(
    private readonly dates: DateProvider = new DeterministicDateProvider(),
  ) {
    super();
  }

  /** Replaces account. */
  set account(value: Account | null) {
    this.currentAccount = value;
  }

  /** Injects the deterministic error returned by subsequent operations. */
  set error(value: AccountError | undefined) {
    this.currentError = value;
  }

  /** Provisions account. */
  provisionAccount(): Promise<AccountResult<Account>> {
    return this.executeOperation(() => {
      if (!this.currentAccount) {
        const now = this.dates.now().toISOString();

        this.currentAccount = accountBuilder({
          createdAt: now,
          onboardingStatus: "pending",
          updatedAt: now,
        }).build();
      }

      return { ok: true, value: this.currentAccount };
    });
  }

  /** Completes onboarding once while preserving the first completion timestamp. */
  completeOnboarding(): Promise<AccountResult<Account>> {
    return this.executeOperation(() => {
      if (!this.currentAccount) {
        return {
          ok: false,
          error: {
            kind: "not-found",
            code: "ACCOUNT_NOT_FOUND",
            retryable: false,
          },
        };
      }

      if (this.currentAccount.onboardingStatus === "pending") {
        this.currentAccount = {
          ...this.currentAccount,
          onboardingStatus: "completed",
          updatedAt: this.dates.now().toISOString(),
        };
      }

      return { ok: true, value: this.currentAccount };
    });
  }

  /** Retrieves account. */
  retrieveAccount(): Promise<AccountResult<Account>> {
    return this.executeOperation(() =>
      this.currentAccount
        ? { ok: true, value: this.currentAccount }
        : {
            ok: false,
            error: {
              kind: "not-found",
              code: "ACCOUNT_NOT_FOUND",
              retryable: false,
            },
          },
    );
  }

  /** Updates account. */
  updateAccount(
    payload: UpdateAccountPayload,
  ): Promise<AccountResult<Account>> {
    return this.executeOperation(() => {
      if (!this.currentAccount) {
        return {
          ok: false,
          error: {
            kind: "not-found",
            code: "ACCOUNT_NOT_FOUND",
            retryable: false,
          },
        };
      }

      const displayName = payload.displayName?.trim() || null;

      if ((displayName?.length ?? 0) > 80) {
        return {
          ok: false,
          error: {
            kind: "validation",
            code: "DISPLAY_NAME_TOO_LONG",
            retryable: false,
          },
        };
      }

      this.currentAccount = {
        ...this.currentAccount,
        displayName,
        updatedAt: this.dates.now().toISOString(),
      };

      return { ok: true, value: this.currentAccount };
    });
  }

  /** Executes one operation through its typed error boundary. */
  private async executeOperation<Value>(
    operation: () => AccountResult<Value> | Promise<AccountResult<Value>>,
  ): Promise<AccountResult<Value>> {
    if (this.currentError) return { ok: false, error: this.currentError };

    try {
      return await operation();
    } catch (error) {
      return { ok: false, error: mapAccountAdapterError(error) };
    }
  }
}
