import { createSlice } from "@reduxjs/toolkit";

import type { AuthError } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { AuthUser, Session } from "@core/auth/domain/auth";

/**
 * Durable authentication state shared by navigation and account flows.
 */
export interface AuthState {
  /**
   * Current lifecycle state of the latest auth-related request.
   */
  status: "idle" | "loading" | "success" | "error";

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

  /**
   * Most recent authentication error shown by auth flows.
   */
  error: AuthError | null;

  /**
   * Flag consumed by app runtime to coordinate logout side effects.
   */
  logoutRequested: boolean;
}

const initialAuthState: AuthState = {
  status: "idle",
  user: null,
  session: null,
  account: null,
  error: null,
  logoutRequested: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLoading: (state) => ({
      ...state,
      status: "loading",
      error: null,
      logoutRequested: false,
    }),
    setAccount: (state, action) => ({
      ...state,
      account: action.payload,
    }),
    setAuth: (state, action) => ({
      status: "success",
      user: action.payload.user,
      session: action.payload.session,
      account: action.payload.account,
      error: null,
      logoutRequested: false,
    }),
    setError: (state, action) => ({
      ...state,
      error: action.payload,
      status: "error",
      logoutRequested: false,
    }),
    markLogoutRequested: (state) => ({
      ...state,
      logoutRequested: true,
    }),
    clearAuth: (state) => ({
      ...state,
      status: "idle",
      user: null,
      session: null,
      account: null,
      error: null,
      logoutRequested: false,
    }),
  },
});

export const {
  setAuth,
  setError,
  clearAuth,
  setLoading,
  setAccount,
  markLogoutRequested,
} = authSlice.actions;
