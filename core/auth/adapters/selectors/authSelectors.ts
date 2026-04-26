import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../initReduxStore";
import { Account } from "../../domain/account";

export const selectIsConnected = (state: RootState): boolean =>
  state.auth.status === "success";

export const selectCurrentAccount = (state: RootState): Account | null =>
  state.auth.account;

export const selectAccount = createSelector(
  [selectCurrentAccount],
  (account): { account: Account | null } => {
    if (!account) return { account: null };

    return { account };
  },
);
