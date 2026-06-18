/** Waits for a fixed delay to simulate async infrastructure latency. */
export function sleep(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}
