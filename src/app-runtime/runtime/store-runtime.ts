import { persistStore } from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import {
  authApi,
  authSessionListenerMiddleware,
} from "@/app-runtime/runtime/auth-runtime";
import { connectAuthSessionProvider } from "@/app-runtime/runtime/auth-session-provider";
import { whitelistFulfilledApiQueries } from "@/app-runtime/runtime/persisted-api-cache";
import { secureSessionStorage } from "@/app-runtime/runtime/secure-session-storage";
import {
  subscriptionApi,
  subscriptionSessionListenerMiddleware,
} from "@/app-runtime/runtime/subscription-runtime";
import { createStore } from "@core/init-redux-store";

const persistConfig = {
  key: "root",
  storage: secureSessionStorage,
  stateReconciler: autoMergeLevel2,
  transforms: [whitelistFulfilledApiQueries],
};

export const store = createStore(
  {
    authApi,
    subscriptionApi,
  },
  {},
  {},
  persistConfig,
  [
    authSessionListenerMiddleware.middleware,
    subscriptionSessionListenerMiddleware.middleware,
  ],
);

connectAuthSessionProvider(() => store.getState().auth.session);

export const persistor = persistStore(store);
