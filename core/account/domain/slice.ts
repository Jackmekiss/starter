import { createSlice } from "@reduxjs/toolkit";

import type { Account } from "@core/account/domain/account";

/** Defines the account state contract. */
export interface AccountState {
  /** Current account stored in Redux. */
  current: Account | null;
}

const initialState: AccountState = { current: null };

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentAccount: (state, action) => ({
      ...state,
      current: action.payload,
    }),
    clearAccount: () => initialState,
  },
});

export const { clearAccount, setCurrentAccount } = accountSlice.actions;
