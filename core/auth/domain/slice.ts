import { createSlice } from "@reduxjs/toolkit";

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
}

const initialAuthState: AuthState = {
  user: null,
  session: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setAuth: (state, action) => ({
      user: action.payload.user,
      session: action.payload.session,
    }),
    clearAuth: () => initialAuthState,
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
