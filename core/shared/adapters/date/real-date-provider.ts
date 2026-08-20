import type { DateProvider } from "@core/shared/gateways/date-provider";

/**
 * Reads the current time from the runtime system clock.
 */
export class RealDateProvider implements DateProvider {
  /** Reads the runtime system clock. */
  now(): Date {
    return new Date();
  }
}
