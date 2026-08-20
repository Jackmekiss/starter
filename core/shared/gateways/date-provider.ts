/**
 * Provides the current date without coupling business code to the system
 * clock.
 */
export interface DateProvider {
  /** Reads the current date. */
  now(): Date;
}
