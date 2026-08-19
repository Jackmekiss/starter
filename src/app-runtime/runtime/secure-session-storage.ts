import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import type { Session } from "@core/auth/domain/auth";
import type { WebStorage } from "redux-persist";

const AUTH_STATE_KEY = "auth";
const SECURE_SESSION_KEY = "starter.auth.session";
const SENSITIVE_SESSION_FIELDS = new Set(["accessToken", "refreshToken"]);

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/** Redux Persist's serialized root object. */
type PersistedRootState = Record<string, string>;

let pendingWrite = Promise.resolve();

/**
 * Narrows an unknown value to a plain key-value object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates the minimum session shape before credentials enter runtime state.
 */
function isSession(value: unknown): value is Session {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.userId === "string" &&
    typeof value.accessToken === "string" &&
    (value.refreshToken === undefined ||
      typeof value.refreshToken === "string") &&
    (value.expiresAt === undefined || typeof value.expiresAt === "number")
  );
}

/**
 * Validates Redux Persist's serialized root object.
 */
function isPersistedRootState(value: unknown): value is PersistedRootState {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

/**
 * Serializes persistence writes so an older token cannot overwrite a newer
 * rotated token when Redux Persist flushes updates in quick succession.
 */
function enqueueWrite(operation: () => Promise<void>): Promise<void> {
  const nextWrite = pendingWrite.then(operation, operation);
  pendingWrite = nextWrite.catch(() => undefined);

  return nextWrite;
}

/**
 * Parses a JSON object without letting malformed persistence data break the
 * storage adapter's fallback behavior.
 */
function parseObject(value: string): Record<string, unknown> | null {
  try {
    const parsedValue: unknown = JSON.parse(value);

    return isRecord(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

/**
 * Removes credential copies from persisted domain state and RTK Query results.
 */
function removeSensitiveSessionFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeSensitiveSessionFields);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !SENSITIVE_SESSION_FIELDS.has(key))
      .map(([key, item]) => [key, removeSensitiveSessionFields(item)]),
  );
}

/**
 * Reads the auth state embedded in Redux Persist's serialized root object.
 */
function readAuthState(
  rootState: PersistedRootState,
): Record<string, unknown> | null {
  const serializedAuthState = rootState[AUTH_STATE_KEY];

  return typeof serializedAuthState === "string"
    ? parseObject(serializedAuthState)
    : null;
}

/**
 * Returns a persisted root value with credential copies removed and the
 * authentication session replaced.
 */
function serializePersistedState(
  rootState: PersistedRootState,
  authState: Record<string, unknown>,
  session: Session | null,
): string {
  const sanitizedRootState = Object.fromEntries(
    Object.entries(rootState).map(([key, serializedState]) => {
      const parsedState: unknown = (() => {
        try {
          return JSON.parse(serializedState);
        } catch {
          return null;
        }
      })();

      if (parsedState === null) {
        return [key, serializedState];
      }

      const sanitizedState = removeSensitiveSessionFields(parsedState);

      if (key === AUTH_STATE_KEY && isRecord(sanitizedState)) {
        return [
          key,
          JSON.stringify({
            ...sanitizedState,
            session,
          }),
        ];
      }

      return [key, JSON.stringify(sanitizedState)];
    }),
  );

  return JSON.stringify(sanitizedRootState);
}

/**
 * Reads the current native secure-store session when the platform supports it.
 */
async function readSecureSession(): Promise<Session | null> {
  if (!(await SecureStore.isAvailableAsync())) {
    return null;
  }

  const serializedSession = await SecureStore.getItemAsync(
    SECURE_SESSION_KEY,
    secureStoreOptions,
  );

  if (!serializedSession) {
    return null;
  }

  const session = parseObject(serializedSession);

  return isSession(session) ? session : null;
}

/**
 * Writes or clears the native secure-store session. Unsupported platforms keep
 * the session in memory only and never fall back to unencrypted persistence.
 */
async function writeSecureSession(session: Session | null): Promise<void> {
  if (!(await SecureStore.isAvailableAsync())) {
    return;
  }

  if (session) {
    await SecureStore.setItemAsync(
      SECURE_SESSION_KEY,
      JSON.stringify(session),
      secureStoreOptions,
    );
    return;
  }

  await SecureStore.deleteItemAsync(SECURE_SESSION_KEY, secureStoreOptions);
}

/**
 * Redux Persist storage that keeps the authentication session in native secure
 * storage while leaving non-sensitive application state in AsyncStorage.
 */
export const secureSessionStorage: WebStorage = {
  async getItem(key) {
    await pendingWrite;

    const serializedRootState = await AsyncStorage.getItem(key);

    if (!serializedRootState) {
      return null;
    }

    const parsedRootState = parseObject(serializedRootState);
    const rootState = isPersistedRootState(parsedRootState)
      ? parsedRootState
      : null;

    if (!rootState) {
      return serializedRootState;
    }

    const authState = readAuthState(rootState);

    if (!authState) {
      return serializedRootState;
    }

    const secureSession = await readSecureSession();

    return serializePersistedState(rootState, authState, secureSession);
  },

  setItem(key, serializedRootState) {
    return enqueueWrite(async () => {
      const parsedRootState = parseObject(serializedRootState);
      const rootState = isPersistedRootState(parsedRootState)
        ? parsedRootState
        : null;
      const authState = rootState ? readAuthState(rootState) : null;

      if (!rootState || !authState) {
        await AsyncStorage.setItem(key, serializedRootState);
        return;
      }

      await writeSecureSession(
        isSession(authState.session) ? authState.session : null,
      );
      await AsyncStorage.setItem(
        key,
        serializePersistedState(rootState, authState, null),
      );
    });
  },

  removeItem(key) {
    return enqueueWrite(async () => {
      await writeSecureSession(null);
      await AsyncStorage.removeItem(key);
    });
  },
};
