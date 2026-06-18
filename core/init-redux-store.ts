import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { authSlice } from "./auth/domain/slice";
import {
  subscriptionOfferingSlice,
  subscriptionSlice,
} from "./subscription/domain/slice";

import type { PersistConfig as ReduxPersistConfig } from "redux-persist";
import type {
  Action,
  Middleware,
  Reducer,
  ThunkDispatch,
} from "@reduxjs/toolkit";

/** RTK Query API shape required for dynamic reducer and middleware wiring. */
export interface StoreApi {
  reducerPath: string;
  reducer: Reducer;
  middleware: Middleware;
}

/** Bounded-context APIs that can be attached to the Redux store. */
export interface Apis {
  authApi: StoreApi;
  subscriptionApi: StoreApi;
}

/** Runtime dependencies made available to thunks and future use-cases. */
export interface Dependencies {}

function createReducers(apis: Partial<Apis>) {
  combineReducers({
    ...(apis.authApi && {
      [apis.authApi.reducerPath]: apis.authApi.reducer,
    }),
    ...(apis.subscriptionApi && {
      [apis.subscriptionApi.reducerPath]: apis.subscriptionApi.reducer,
    }),
    [authSlice.name]: authSlice.reducer,
    [subscriptionOfferingSlice.name]: subscriptionOfferingSlice.reducer,
    [subscriptionSlice.name]: subscriptionSlice.reducer,
  });

/** Persist settings accepted by the starter store factory. */
export type PersistConfig = Pick<
  ReduxPersistConfig<RootState>,
  "key" | "storage"
>;

/** Creates the Redux store with optional bounded-context APIs and persistence. */
export function createStore(
  apis: Partial<Apis> = {},
  dependencies: Partial<Dependencies> = {},
  preloadedState?: Partial<RootState>,
  persistConfig?: PersistConfig,
  customMiddlewares: Middleware[] = [],
) {
  let rootReducer = createReducers(apis);

  if (persistConfig) {
    rootReducer = persistReducer<RootState>(
      persistConfig,
      createReducers(apis),
    );
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

/** Complete Redux state shape produced by the starter reducers. */
export type RootState = ReturnType<ReturnType<typeof createReducers>>;

/** Store instance with the domain dependency type attached to dispatch. */
export type ReduxStore = ReturnType<typeof createStore> & {
  dispatch: ThunkDispatch<RootState, Dependencies, Action>;
};
