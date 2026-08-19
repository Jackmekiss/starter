import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { HttpAuthBaseQuery } from "@core/auth/adapters/http/http-auth-base-query";
import { InMemoryAuthBaseQuery } from "@core/auth/adapters/in-memory/in-memory-auth-base-query";
import { createAuthApiOptions } from "@core/auth/apis/auth-api";
import { accountBuilder } from "@core/auth/domain/builders/account-builder";
import { sessionBuilder } from "@core/auth/domain/builders/session-builder";
import { createStore } from "@core/init-redux-store";

import type { Account } from "@core/auth/domain/account";
import type { AuthBaseQuery } from "@core/auth/gateways/auth-base-query";
import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the auth API used by account retrieval behavior specs.
 */
function createAuthApi(authBaseQuery: AuthBaseQuery) {
  return createApi(createAuthApiOptions(authBaseQuery.handle()));
}

describe("Account Retrieval", () => {
  let store: ReduxStore;
  let authBaseQuery: InMemoryAuthBaseQuery;
  let authApi: ReturnType<typeof createAuthApi>;

  beforeEach(() => {
    authBaseQuery = new InMemoryAuthBaseQuery();
    authApi = createAuthApi(authBaseQuery);
    store = createStore({ authApi }, {});
  });

  it("should retrieve account", async () => {
    const accountId = "ba925002-28f2-4dcc-a654-93428b62f7cb";

    authBaseQuery.account = accountBuilder().withId(accountId).build();

    await retrieveAccount();

    const account = accountBuilder().withId(accountId).build();

    expectAccount(account);
  });

  it("should store null when account does not exist", async () => {
    authBaseQuery.account = null;

    await retrieveAccount();

    expectAccount(null);
  });

  it("should expose a technical failure without changing the account", async () => {
    authBaseQuery.error = { kind: "network", retryable: true };

    await expect(retrieveAccount()).rejects.toEqual({
      kind: "network",
      retryable: true,
    });

    expectAccount(null);
  });

  it("should read the current session for a protected HTTP request", async () => {
    const account = accountBuilder().withId("remote-account-id").build();
    const session = sessionBuilder().withUserId(account.id).build();
    let authorizationHeader: string | null = null;
    const httpAuthBaseQuery = new HttpAuthBaseQuery({
      baseUrl: "https://auth.example.test",
      sessionProvider: { getSession: () => session },
      fetcher: async (_, init) => {
        authorizationHeader = new Headers(init.headers).get("Authorization");
        return new Response(JSON.stringify(account), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    });
    authApi = createAuthApi(httpAuthBaseQuery);
    store = createStore({ authApi }, {});

    await retrieveAccount();

    expect(authorizationHeader).toBe(`Bearer ${session.accessToken}`);
    expectAccount(account);
  });

  /**
   * Dispatches the account retrieval use-case.
   */
  async function retrieveAccount() {
    await store.dispatch(authApi.endpoints.retrieveAccount.initiate()).unwrap();
  }

  /**
   * Expects the retrieved account to be stored in auth state.
   */
  function expectAccount(accountExpected: Account | null) {
    expect(store.getState().auth.account).toEqual(accountExpected);
  }
});
