import {
  useDispatch as useReactReduxDispatch,
  useSelector as useReactReduxSelector,
} from "react-redux";

import type { ReduxStore, RootState } from "@core/init-redux-store";

/**
 * Typed dispatch hook for application Redux actions and thunks.
 */
export const useDispatch =
  useReactReduxDispatch.withTypes<ReduxStore["dispatch"]>();

/**
 * Typed selector hook for reading from the application Redux state.
 */
export const useSelector = useReactReduxSelector.withTypes<RootState>();
