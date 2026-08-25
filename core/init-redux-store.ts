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
import { accountSlice } from "@core/account/domain/slice";
import {
  subscriptionOfferingSlice,
  subscriptionSlice,
} from "@core/subscription/domain/slice";

import type {
  Action,
  Middleware,
  Reducer,
  StoreEnhancer,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import type { PersistConfig as ReduxPersistConfig } from "redux-persist";

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
  /** Account RTK Query API mounted when Account endpoints are available. */
  accountApi: StoreApi;
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
 * Runtime-specific Redux configuration supplied by the application shell.
 */
export interface StoreRuntimeConfiguration {
  /** Enables or disables Redux Toolkit's built-in DevTools integration. */
  devTools?: boolean;
  /** Store enhancers owned by the application runtime. */
  enhancers?: StoreEnhancer[];
}

/**
 * Creates the root reducer from enabled APIs and domain slices.
 */
function createReducers(apis: Partial<Apis>) {
  return combineReducers({
    ...(apis.accountApi && {
      [apis.accountApi.reducerPath]: apis.accountApi.reducer,
    }),
    ...(apis.authApi && {
      [apis.authApi.reducerPath]: apis.authApi.reducer,
    }),
    ...(apis.subscriptionApi && {
      [apis.subscriptionApi.reducerPath]: apis.subscriptionApi.reducer,
    }),
    [accountSlice.name]: accountSlice.reducer,
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
  dependencies: Dependencies = {},
  preloadedState?: Partial<RootState>,
  persistConfig?: PersistConfig,
  customMiddlewares: Middleware[] = [],
  runtimeConfiguration: StoreRuntimeConfiguration = {},
) {
  const rootReducer = createReducers(apis);
  const apiMiddlewares = createMiddlewares(apis);

  /**
   * Configures both persisted and in-memory stores while preserving their
   * distinct reducer and preloaded-state types.
   */
  function configureApplicationStore<State, PreloadedState = State>(
    reducer: Reducer<State, Action, PreloadedState>,
    initialState?: PreloadedState,
  ) {
    return configureStore({
      reducer,
      devTools: runtimeConfiguration.devTools,
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
      enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers().concat(...(runtimeConfiguration.enhancers ?? [])),
      preloadedState: initialState,
    });
  }

  return persistConfig
    ? configureApplicationStore(
        persistReducer<RootState>(persistConfig, rootReducer),
      )
    : configureApplicationStore(rootReducer, preloadedState);
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
