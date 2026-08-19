import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore } from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import { authApi } from "@/app-runtime/runtime/auth-runtime";
import { createStore } from "@core/init-redux-store";
import { subscriptionOfferingSlice } from "@core/subscription/domain/slice";

const persistConfig = {
  key: "root-v2",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: [subscriptionOfferingSlice.name],
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
