import type { DateProvider } from "@core/shared/gateways/date-provider";

/**
 * Provides a controllable timestamp for deterministic runtimes and specs.
 */
export class DeterministicDateProvider implements DateProvider {
  private currentDateOfNow = new Date(0);

  /** Reads the configured date. */
  now(): Date {
    return this.currentDateOfNow;
  }

  /** Sets the date returned by subsequent reads. */
  set dateOfNow(date: Date) {
    this.currentDateOfNow = date;
  }
}
