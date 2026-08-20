import { createSlice } from "@reduxjs/toolkit";

import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";

/**
 * Durable authentication state shared by navigation and account flows.
 */
export interface AuthState {
  /**
   * Authenticated identity currently known by the app.
   */
  user: AuthUser | null;

  /**
   * Active session tokens, or null when the user is unauthenticated.
   */
  session: Session | null;

  /**
   * Account profile attached to the authenticated identity.
   */
  account: Account | null;
}

const initialAuthState: AuthState = {
  user: null,
  session: null,
  account: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setAccount: (state, action) => ({
      ...state,
      account: action.payload,
    }),
    setAuth: (state, action) => ({
      user: action.payload.user,
      session: action.payload.session,
      account: action.payload.account,
    }),
    clearAuth: (state) => ({
      ...state,
      user: null,
      session: null,
      account: null,
    }),
  },
});

export const { setAuth, clearAuth, setAccount } = authSlice.actions;
