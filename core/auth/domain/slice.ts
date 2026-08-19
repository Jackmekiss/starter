import { createSlice } from "@reduxjs/toolkit";

import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";

/**
 * Durable authentication state shared by navigation and account flows.
 */
export interface AuthState {
  /**
   * Current lifecycle state of the latest auth-related request.
   */
  status: "idle" | "success";

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
  status: "idle",
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
      status: "success",
      user: action.payload.user,
      session: action.payload.session,
      account: action.payload.account,
    }),
    restoreSession: (state, action) => ({
      ...state,
      status: action.payload ? "success" : "idle",
      user: null,
      session: action.payload,
      account: null,
    }),
    clearAuth: (state) => ({
      ...state,
      status: "idle",
      user: null,
      session: null,
      account: null,
    }),
  },
});

export const { setAuth, restoreSession, clearAuth, setAccount } =
  authSlice.actions;
