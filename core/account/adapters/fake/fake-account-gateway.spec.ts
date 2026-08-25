import { describe, expect, it } from "vitest";

import { FakeAccountGateway } from "@core/account/adapters/fake/fake-account-gateway";

describe("FakeAccountGateway", () => {
  it("delegates deterministic failures to every operation", async () => {
    const gateway = new FakeAccountGateway(0);
    const error = { kind: "network" as const, retryable: true };

    gateway.error = error;

    await expect(gateway.provisionAccount()).resolves.toEqual({
      ok: false,
      error,
    });
    await expect(gateway.retrieveAccount()).resolves.toEqual({
      ok: false,
      error,
    });
    await expect(gateway.completeOnboarding()).resolves.toEqual({
      ok: false,
      error,
    });
    await expect(
      gateway.updateAccount({ displayName: "Ada" }),
    ).resolves.toEqual({ ok: false, error });
  });
});
