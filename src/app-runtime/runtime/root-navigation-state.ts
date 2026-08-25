import type { Account } from "@core/account/domain/account";

/** Exclusive shell destinations derived from session and durable Account state. */
export type RootNavigationState =
  | "account-error"
  | "auth"
  | "onboarding"
  | "splash"
  | "tabs";

/** Inputs required to select one root destination without transport knowledge. */
export interface RootNavigationStateInput {
  /** Current durable Account, once retrieval has settled. */
  account: Account | null;
  /** Whether the authenticated session is usable. */
  isConnected: boolean;
  /** Whether the Account retrieval is unresolved. */
  isPreparingAccount: boolean;
}

/** Applies the root navigation matrix from durable session and Account truth. */
export function resolveRootNavigationState({
  account,
  isConnected,
  isPreparingAccount,
}: RootNavigationStateInput): RootNavigationState {
  if (isPreparingAccount) return "splash";
  if (!isConnected) return "auth";
  if (!account) return "account-error";

  return account.onboardingStatus === "pending" ? "onboarding" : "tabs";
}
