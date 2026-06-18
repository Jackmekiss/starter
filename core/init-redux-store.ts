import {
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import type {
  Action,
  Middleware,
  Reducer,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import type { PersistConfig as ReduxPersistConfig } from "redux-persist";
import { authSlice } from "./auth/domain/slice";
import {
  subscriptionOfferingSlice,
  subscriptionSlice,
} from "./subscription/domain/slice";

export interface StoreApi {
  reducerPath: string;
  reducer: Reducer;
  middleware: Middleware;
}

export interface Apis {
  authAPI: StoreApi;
  subscriptionAPI: StoreApi;
}

export interface Dependencies {}

const createReducers = (apis: Partial<Apis>) =>
  combineReducers({
    ...(apis.authAPI && {
      [apis.authAPI.reducerPath]: apis.authAPI.reducer,
    }),
    ...(apis.subscriptionAPI && {
      [apis.subscriptionAPI.reducerPath]: apis.subscriptionAPI.reducer,
    }),
    [authSlice.name]: authSlice.reducer,
    [subscriptionOfferingSlice.name]: subscriptionOfferingSlice.reducer,
    [subscriptionSlice.name]: subscriptionSlice.reducer,
  });

export type PersistConfig = Pick<ReduxPersistConfig<RootState>, "key" | "storage">;

export function createStore(
  apis: Partial<Apis> = {},
  dependencies: Partial<Dependencies> = {},
  preloadedState?: Partial<RootState>,
  persistConfig?: PersistConfig,
  customMiddlewares: Middleware[] = [],
) {
  let rootReducer = createReducers(apis);

  if (persistConfig) {
    rootReducer = persistReducer<RootState>(persistConfig, createReducers(apis));
  }

  const apiMiddlewares: Middleware[] = Object.values(apis).map(
    (api) => api.middleware,
  );

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        thunk: {
          extraArgument: dependencies,
        },
      })
        .concat(apiMiddlewares)
        .concat(...customMiddlewares),
    preloadedState,
  });

  return store;
}

export type RootState = ReturnType<ReturnType<typeof createReducers>>;

export type ReduxStore = ReturnType<typeof createStore> & {
  dispatch: ThunkDispatch<RootState, Dependencies, Action>;
};
