/** Successful operation result carrying its resolved value. */
export interface SuccessResult<Value> {
  /** Identifies the successful result branch. */
  ok: true;
  /** Value produced by the operation. */
  value: Value;
}

/** Failed operation result carrying its typed failure. */
export interface FailureResult<Failure> {
  /** Identifies the failed result branch. */
  ok: false;
  /** Failure produced by the operation. */
  error: Failure;
}

/** Explicit success-or-failure result returned by an application operation. */
export type Result<Value, Failure> =
  | SuccessResult<Value>
  | FailureResult<Failure>;
