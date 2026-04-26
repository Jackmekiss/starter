import { createSlice } from "@reduxjs/toolkit";
import { AuthError } from "../apis/types";
import { Account } from "./account";
import { AuthUser, Session } from "./auth";

export interface AuthState {
  status: "idle" | "loading" | "success" | "error";
  user: AuthUser | null;
  session: Session | null;
  account: Account | null;
  error: AuthError | null;
  logoutRequested: boolean;
}

const initialAuthState: AuthState = {
  status: "idle",
  user: null,
  session: null,
  account: null,
  error: null,
  logoutRequested: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLoading: (state) => ({
      ...state,
      status: "loading",
      error: null,
      logoutRequested: false
    }),
    setAccount: (state, action) => ({
      ...state,
      account: action.payload
    }),
    setAuth: (state, action) => ({
      status: "success",
      user: action.payload.user,
      session: action.payload.session,
      account: action.payload.account,
      error: null,
      logoutRequested: false
    }),
    setError: (state, action) => ({
      ...state,
      error: action.payload,
      status: "error",
      logoutRequested: false
    }),
    markLogoutRequested: (state) => ({
      ...state,
      logoutRequested: true
    }),
    clearAuth: (state) => ({
      ...state,
      status: "idle",
      user: null,
      session: null,
      account: null,
      error: null,
      logoutRequested: false
    })
  }
});

export const {
  setAuth,
  setError,
  clearAuth,
  setLoading,
  setAccount,
  markLogoutRequested
} = authSlice.actions;
