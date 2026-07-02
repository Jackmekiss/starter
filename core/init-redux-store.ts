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

import { authSlice } from "@core/auth/domain/slice";
import {
  subscriptionOfferingSlice,
  subscriptionSlice,
} from "@core/subscription/domain/slice";

import type { PersistConfig as ReduxPersistConfig } from "redux-persist";
import type {
  Action,
  Middleware,
  Reducer,
  ThunkDispatch,
} from "@reduxjs/toolkit";

/**
 * Minimal RTK Query API surface needed by the Redux store.
 */
interface StoreApi {
  reducerPath: string;
  reducer: Reducer;
  middleware: Middleware;
}

/**
 * RTK Query API instances mounted into the Redux store.
 */
export interface Apis {
  /**
   * Auth RTK Query API mounted when authentication endpoints are available.
   */
  authApi: StoreApi;

  /**
   * Subscription RTK Query API mounted when billing endpoints are available.
   */
  subscriptionApi: StoreApi;
}

/**
 * Extra dependencies available to Redux thunks.
 */
export interface Dependencies {}

/**
 * Creates the root reducer from enabled APIs and domain slices.
 */
function createReducers(apis: Partial<Apis>) {
  return combineReducers({
    ...(apis.authApi && {
      [apis.authApi.reducerPath]: apis.authApi.reducer,
    }),
    ...(apis.subscriptionApi && {
      [apis.subscriptionApi.reducerPath]: apis.subscriptionApi.reducer,
    }),
    [authSlice.name]: authSlice.reducer,
    [subscriptionSlice.name]: subscriptionSlice.reducer,
    [subscriptionOfferingSlice.name]: subscriptionOfferingSlice.reducer,
  });
}

/**
 * Collects middleware exposed by enabled RTK Query APIs.
 */
function createMiddlewares(apis: Partial<Apis>): Middleware[] {
  return Object.values(apis).flatMap((api) => (api ? [api.middleware] : []));
}

/**
 * Minimal persistence configuration accepted by the app store factory.
 */
export interface PersistConfig {
  /**
   * Storage namespace used by redux-persist for the root state.
   */
  key: string;

  /**
   * Persistence backend responsible for reading and writing serialized state.
   */
  storage: ReduxPersistConfig<RootState>["storage"];
}

/**
 * Creates the application Redux store with optional APIs, dependencies, preloaded state, and persistence.
 */
export function createStore(
  apis: Partial<Apis> = {},
  dependencies: Partial<Dependencies> = {},
  preloadedState?: Partial<RootState>,
  persistConfig?: PersistConfig,
  customMiddlewares: Middleware[] = [],
) {
  const rootReducer = createReducers(apis);
  const apiMiddlewares = createMiddlewares(apis);

  if (persistConfig) {
    const persistedReducer = persistReducer<RootState>(
      persistConfig,
      rootReducer,
    );

    return configureStore({
      reducer: persistedReducer,
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
    });
  }

  return configureStore({
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
}

/**
 * Root Redux state inferred from the root reducer.
 */
export type RootState = ReturnType<ReturnType<typeof createReducers>>;

/**
 * Redux store type with thunk dispatch dependencies preserved.
 */
export type ReduxStore = ReturnType<typeof createStore> & {
  dispatch: ThunkDispatch<RootState, Dependencies, Action>;
};
