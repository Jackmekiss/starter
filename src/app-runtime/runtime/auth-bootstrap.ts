import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApi } from "@/app-runtime/runtime/auth-runtime";
import { sessionStorage } from "@/app-runtime/runtime/session-storage-runtime";
import { store } from "@/app-runtime/runtime/store-runtime";
import { clearAuth, restoreSession } from "@core/auth/domain/slice";

import type { ReduxStore } from "@core/init-redux-store";

let authBootstrapPromise: Promise<void> | undefined;
const LEGACY_AUTH_STORAGE_KEYS = ["persist:root", "session"];

/** Restores the secure session and retrieves its account before routing starts. */
export function bootstrapAuth(): Promise<void> {
  authBootstrapPromise ??= runAuthBootstrap();
  return authBootstrapPromise;
}

/** Executes the one-time authentication bootstrap sequence. */
async function runAuthBootstrap(): Promise<void> {
  await clearLegacyAuthStorage();

  const sessionResult = await sessionStorage.retrieveSession();
  if (!sessionResult.ok) {
    store.dispatch(clearAuth());
    return;
  }

  const { value: session } = sessionResult;
  store.dispatch(restoreSession(session));
  if (!session) return;

  const dispatch: ReduxStore["dispatch"] = store.dispatch;
  const accountQuery = dispatch(
    authApi.endpoints.retrieveAccount.initiate(undefined, {
      forceRefetch: true,
    }),
  );

  try {
    const account = await accountQuery.unwrap();
    if (account) return;

    await sessionStorage.clearSession();
    store.dispatch(clearAuth());
  } catch {
    // The secure session remains the source of truth during transient failures.
  } finally {
    accountQuery.unsubscribe();
  }
}

/** Removes credentials persisted by the previous AsyncStorage-based runtime. */
async function clearLegacyAuthStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(LEGACY_AUTH_STORAGE_KEYS);
  } catch {
    // Startup continues because the legacy keys are never read by this runtime.
  }
}
