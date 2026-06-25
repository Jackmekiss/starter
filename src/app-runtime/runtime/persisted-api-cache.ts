/**
 * RTK Query cache persistence filter.
 *
 * Redux Persist would otherwise save every in-flight query (pending, rejected, etc.).
 * On rehydration those stale entries are restored as-is, so pending queries can be
 * replayed or leave the UI stuck in a loading state. We only persist fulfilled
 * queries so the restored cache contains usable data and fresh requests can run
 * normally on startup.
 */
import { QueryStatus } from "@reduxjs/toolkit/query";
import { pickBy } from "lodash";
import { createTransform } from "redux-persist";

/**
 * Persisted RTK Query entry shape used to identify fulfilled cache records.
 */
interface PersistedApiQuery {
  status?: QueryStatus;
}

/**
 * Persisted RTK Query slice shape after Redux Persist rehydrates API cache state.
 */
interface PersistedApiState {
  queries?: Record<string, PersistedApiQuery>;
  [key: string]: unknown;
}

/**
 * Narrows persisted Redux API cache payloads before filtering fulfilled queries.
 */
function isPersistedApiState(value: unknown): value is PersistedApiState {
  return typeof value === "object" && value !== null;
}

/**
 * Keeps only fulfilled RTK Query cache entries when persisting API slices.
 */
function whitelistFulfilledQueries(inboundState: unknown): unknown {
  if (isPersistedApiState(inboundState) && inboundState.queries) {
    return {
      ...inboundState,
      queries:
        pickBy(inboundState.queries, { status: QueryStatus.fulfilled }) || {},
    };
  }

  return inboundState;
}

/**
 * Redux Persist transform that stores only usable RTK Query cache records.
 */
export const whitelistFulfilledApiQueries = createTransform(
  whitelistFulfilledQueries,
  whitelistFulfilledQueries,
);
