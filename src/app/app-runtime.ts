import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { pickBy } from "lodash";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { createTransform, persistStore } from "redux-persist";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
import { FakeAuthBaseQuery } from "../../core/auth/adapters/fake/FakeAuthBaseQuery";
import { InMemoryAuthBaseQuery } from "../../core/auth/adapters/in-memory/InMemoryAuthBaseQuery";
import { createAuthAPIOptions } from "../../core/auth/apis/authAPI";
import { AuthBaseQuery } from "../../core/auth/gateways/AuthBaseQuery";
import { createStore } from "../../core/initReduxStore";

let authBaseQuery: AuthBaseQuery;

export const appMode = process.env.EXPO_PUBLIC_APP_MODE;

if (appMode === "fake") {
  authBaseQuery = new FakeAuthBaseQuery();
} else {
  authBaseQuery = new InMemoryAuthBaseQuery();
}

const whitelistFulfilledQueries = createTransform(
  (inboundState: any) => {
    if (inboundState?.queries) {
      return {
        ...inboundState,
        queries:
          pickBy(inboundState.queries, { status: QueryStatus.fulfilled }) || {},
      };
    }

    return inboundState;
  },
  (outboundState: any) => {
    if (outboundState?.queries) {
      return {
        ...outboundState,
        queries:
          pickBy(outboundState.queries, { status: QueryStatus.fulfilled }) ||
          {},
      };
    }

    return outboundState;
  },
);

export const authAPI = createApi(createAuthAPIOptions(authBaseQuery.handle()));

export const {
  useRetrieveAccountQuery,
  useUpdateAccountMutation,
  useCompleteOnboardingMutation,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLoginWithAppleMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useDeleteAccountMutation,
  useLogoutMutation,
} = authAPI;

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
  transforms: [whitelistFulfilledQueries],
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const store = createStore(
  {
    authAPI,
  },
  {},
  {},
  persistConfig,
  [],
);

export const persistor = persistStore(store);
