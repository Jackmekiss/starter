import { persistStore } from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import { authApi } from "@/app-runtime/runtime/auth-runtime";
import { whitelistFulfilledApiQueries } from "@/app-runtime/runtime/persisted-api-cache";
import { secureSessionStorage } from "@/app-runtime/runtime/secure-session-storage";
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
  },
  {},
  {},
  persistConfig,
  [],
);

export const persistor = persistStore(store);
