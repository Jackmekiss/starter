import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore } from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import { authApi } from "@/app-runtime/runtime/auth-runtime";
import { whitelistFulfilledApiQueries } from "@/app-runtime/runtime/persisted-api-cache";
import { createStore } from "@core/init-redux-store";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
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
