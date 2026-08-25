import { fakeBaseQuery } from "@reduxjs/toolkit/query";

import { provisionAccountBuilder } from "@core/account/use-cases/account-provisioning/provision-account";
import { completeOnboardingBuilder } from "@core/account/use-cases/onboarding-completion/complete-onboarding";
import { retrieveAccountBuilder } from "@core/account/use-cases/account-retrieval/retrieve-account";
import { updateAccountBuilder } from "@core/account/use-cases/account-updating/update-account";

import type { AccountApiBaseQueryFn } from "@core/account/apis/account-api-base-query";
import type { AccountError } from "@core/account/domain/account-error";
import type { AccountGateway } from "@core/account/gateways/account-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/** Creates account api options. */
export function createAccountApiOptions(gateway: AccountGateway) {
  return {
    baseQuery: fakeBaseQuery<AccountError>(),
    reducerPath: "accountApi",
    endpoints: (
      build: EndpointBuilder<AccountApiBaseQueryFn, never, "accountApi">,
    ) => ({
      ...completeOnboardingBuilder(build, gateway),
      ...provisionAccountBuilder(build, gateway),
      ...retrieveAccountBuilder(build, gateway),
      ...updateAccountBuilder(build, gateway),
    }),
  };
}
