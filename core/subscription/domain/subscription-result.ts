import type { Result } from "@core/shared/domain/result";
import type { SubscriptionError } from "@core/subscription/domain/subscription-error";

/** Result returned by a subscription operation. */
export type SubscriptionResult<Value> = Result<Value, SubscriptionError>;
