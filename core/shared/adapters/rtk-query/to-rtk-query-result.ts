import type { Result } from "@core/shared/domain/result";
import type { QueryReturnValue } from "@reduxjs/toolkit/query";

/** Converts an application Result into RTK Query's explicit result channel. */
export function toRtkQueryResult<Value, Failure>(
  result: Result<Value, Failure>,
): QueryReturnValue<Value, Failure, undefined> {
  return result.ok ? { data: result.value } : { error: result.error };
}
