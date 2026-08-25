import type { Account } from "@core/account/domain/account";
import type { RootState } from "@core/init-redux-store";

/** Selects current account from state. */
export function selectCurrentAccount(state: RootState): Account | null {
  return state.account.current;
}
