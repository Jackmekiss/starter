import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../init-redux-store";
import type { Account } from "../../domain/account";

export function selectIsConnected(state: RootState): boolean {
  return state.auth.status === "success";
}

export function selectCurrentAccount(state: RootState): Account | null {
  return state.auth.account;
}

export const selectAccount = createSelector(
  [selectCurrentAccount],
  (account): { account: Account | null } => {
    if (!account) return { account: null };

    return { account };
  },
);
