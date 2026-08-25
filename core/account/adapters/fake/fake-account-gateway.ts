import { InMemoryAccountGateway } from "@core/account/adapters/in-memory/in-memory-account-gateway";
import { AccountGateway } from "@core/account/gateways/account-gateway";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";
import { sleep } from "@core/shared/adapters/time/sleep";

import type { UpdateAccountPayload } from "@core/account/apis/types";
import type { AccountError } from "@core/account/domain/account-error";
import type { Account } from "@core/account/domain/account";
import type { DateProvider } from "@core/shared/gateways/date-provider";

export class FakeAccountGateway extends AccountGateway {
  private readonly delegate: InMemoryAccountGateway;

  /** Creates the instance with its required dependencies. */
  constructor(
    private readonly latencyMilliseconds = 800,
    dates: DateProvider = new DeterministicDateProvider(),
  ) {
    super();
    this.delegate = new InMemoryAccountGateway(dates);
  }

  /** Injects the same deterministic failure as the in-memory adapter. */
  set error(value: AccountError | undefined) {
    this.delegate.error = value;
  }

  /** Replaces the delegate fixture used by runtime composition and specs. */
  set account(value: Account | null) {
    this.delegate.account = value;
  }

  /** Provisions account. */
  async provisionAccount() {
    await sleep(this.latencyMilliseconds);

    return this.delegate.provisionAccount();
  }

  /** Delegates onboarding completion after the configured latency. */
  async completeOnboarding() {
    await sleep(this.latencyMilliseconds);

    return this.delegate.completeOnboarding();
  }

  /** Retrieves account. */
  async retrieveAccount() {
    await sleep(this.latencyMilliseconds);

    return this.delegate.retrieveAccount();
  }

  /** Updates account. */
  async updateAccount(payload: UpdateAccountPayload) {
    await sleep(this.latencyMilliseconds);

    return this.delegate.updateAccount(payload);
  }
}
