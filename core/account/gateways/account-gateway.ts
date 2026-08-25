import type { UpdateAccountPayload } from "@core/account/apis/types";
import type { Account } from "@core/account/domain/account";
import type { AccountResult } from "@core/account/domain/account-result";

export abstract class AccountGateway {
  /** Provisions account. */
  abstract provisionAccount(): Promise<AccountResult<Account>>;
  /** Completes the backend-owned onboarding lifecycle idempotently. */
  abstract completeOnboarding(): Promise<AccountResult<Account>>;
  /** Retrieves account. */
  abstract retrieveAccount(): Promise<AccountResult<Account>>;
  /** Updates account. */
  abstract updateAccount(
    payload: UpdateAccountPayload,
  ): Promise<AccountResult<Account>>;
}
