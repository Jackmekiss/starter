import {
  Action,
  combineReducers,
  configureStore,
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

export interface PersistConfig {
  key: string;
  storage: any;
}

export const createStore = (
  apis: Partial<Apis> = {},
  dependencies: Partial<Dependencies> = {},
  preloadedState?: Partial<RootState>,
  persistConfig?: PersistConfig,
  customMiddlewares: Middleware[] = [],
) => {
  let rootReducer = createReducers(apis);

  if (persistConfig) {
    rootReducer = persistReducer<any>(persistConfig, createReducers(apis));
  }

  const apiMiddlewares = Object.values(apis).flatMap(
    (api) => api.middleware,
  ) as Middleware[];

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
    preloadedState: preloadedState as any,
  });

  return store;
};

export type RootState = ReturnType<ReturnType<typeof createReducers>>;

export type ReduxStore = ReturnType<typeof createStore> & {
  dispatch: ThunkDispatch<RootState, Dependencies, Action>;
};
