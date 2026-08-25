import type { RootState } from "@core/init-redux-store";

/**
 * Returns whether the auth context currently has a successful session.
 */
export function selectIsConnected(state: RootState): boolean {
  return state.auth.session !== null;
}

/** Returns the authenticated identity without importing Account state. */
export function selectCurrentUser(state: RootState) {
  return state.auth.user;
}
