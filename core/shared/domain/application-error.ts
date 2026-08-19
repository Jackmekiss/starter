/** Technical failure categories shared by every bounded context. */
export type TechnicalApplicationErrorKind =
  | "network"
  | "timeout"
  | "unauthenticated"
  | "forbidden"
  | "rate-limited"
  | "unavailable"
  | "unexpected";

/** Technical failure whose recovery behavior is independent from business context. */
export interface TechnicalApplicationError {
  /** Stable technical category used to select recovery behavior. */
  kind: TechnicalApplicationErrorKind;
  /** Whether repeating the request can reasonably succeed. */
  retryable: boolean;
}

/** Business failure interpreted by the bounded context that owns the action. */
export interface ContextApplicationError<Code extends string> {
  /** Stable category controlling application-level handling. */
  kind: "business" | "validation" | "not-found" | "conflict";
  /** Stable application code independent from infrastructure identifiers. */
  code: Code;
  /** Whether repeating the same action can reasonably succeed. */
  retryable: boolean;
}

/** Failure exposed by an application action with context-owned business codes. */
export type ApplicationError<Code extends string> =
  | TechnicalApplicationError
  | ContextApplicationError<Code>;

/** Narrows an unknown value to the shared technical failure contract. */
export function isTechnicalApplicationError(
  value: unknown,
): value is TechnicalApplicationError {
  if (!isRecord(value) || typeof value.retryable !== "boolean") return false;

  return (
    value.kind === "network" ||
    value.kind === "timeout" ||
    value.kind === "unauthenticated" ||
    value.kind === "forbidden" ||
    value.kind === "rate-limited" ||
    value.kind === "unavailable" ||
    value.kind === "unexpected"
  );
}

/** Narrows an unknown value to a context-owned application failure. */
export function isContextApplicationError(
  value: unknown,
): value is ContextApplicationError<string> {
  if (
    !isRecord(value) ||
    typeof value.code !== "string" ||
    typeof value.retryable !== "boolean"
  ) {
    return false;
  }

  return (
    value.kind === "business" ||
    value.kind === "validation" ||
    value.kind === "not-found" ||
    value.kind === "conflict"
  );
}

/** Narrows unknown values before reading external object fields. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
