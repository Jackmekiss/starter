import type { SubscriptionError } from "@core/subscription/domain/subscription-error";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/** Empty RTK Query transport used because subscription use-cases call their gateway directly. */
export type SubscriptionApiBaseQueryFn = BaseQueryFn<
  void,
  never,
  SubscriptionError
>;
