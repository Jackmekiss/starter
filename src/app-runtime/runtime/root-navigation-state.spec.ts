import { describe, expect, it } from "vitest";

import { resolveRootNavigationState } from "@/app-runtime/runtime/root-navigation-state";
import { accountBuilder } from "@core/account/domain/builders/account-builder";

describe("root navigation state", () => {
  it.each([
    {
      account: null,
      expected: "splash",
      isConnected: false,
      isPreparingAccount: true,
    },
    {
      account: null,
      expected: "auth",
      isConnected: false,
      isPreparingAccount: false,
    },
    {
      account: null,
      expected: "account-error",
      isConnected: true,
      isPreparingAccount: false,
    },
    {
      account: accountBuilder().withOnboardingStatus("pending").build(),
      expected: "onboarding",
      isConnected: true,
      isPreparingAccount: false,
    },
    {
      account: accountBuilder().withOnboardingStatus("completed").build(),
      expected: "tabs",
      isConnected: true,
      isPreparingAccount: false,
    },
  ] as const)("resolves $expected", (input) => {
    expect(resolveRootNavigationState(input)).toBe(input.expected);
  });
});
