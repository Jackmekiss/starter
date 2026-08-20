import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAuthGateway } from "@core/auth/adapters/in-memory/in-memory-auth-gateway";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { createStore } from "@core/init-redux-store";

import type { UpdateAccountPayload } from "@core/auth/apis/types";
import type { Account } from "@core/auth/domain/account";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by account modification behavior specs.
 */
function createAuthApi(authGateway: InMemoryAuthGateway) {
  return createApi(createAuthApiOptions(authGateway));
}

describe("Account Modification", () => {
  let store: ReduxStore;
  let authGateway: InMemoryAuthGateway;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    authApi = createAuthApi(authGateway);
    store = createStore({ authApi }, {});
  });

  it("should update account profile", async () => {
    authGateway.account = accountBuilder()
      .withId("account-to-update")
      .withFirstName("Initial")
      .withLastName("User")
      .withAvatarUri(null)
      .build();

    await updateAccount({
      avatarUri: "https://example.com/avatar.png",
      firstName: "Updated",
      lastName: "Member",
    });

    const account = accountBuilder()
      .withId("account-to-update")
      .withFirstName("Updated")
      .withLastName("Member")
      .withAvatarUri("https://example.com/avatar.png")
      .build();

    expectAccount(account);
  });

  it("should update account onboarding status", async () => {
    authGateway.account = accountBuilder()
      .withId("account-onboarding")
      .withOnboardingStatus("in-progress")
      .build();

    await updateAccount({
      onboardingStatus: "completed",
    });

    const account = accountBuilder()
      .withId("account-onboarding")
      .withOnboardingStatus("completed")
      .build();

    expectAccount(account);
  });

  /**
   * Dispatches the account modification use-case.
   */
  async function updateAccount(payload: UpdateAccountPayload) {
    await store
      .dispatch(authApi.endpoints.updateAccount.initiate(payload))
      .unwrap();
  }

  /**
   * Expects the updated account to be stored in auth state.
   */
  function expectAccount(accountExpected: Account) {
    expect(store.getState().auth.account).toEqual(accountExpected);
  }
});
