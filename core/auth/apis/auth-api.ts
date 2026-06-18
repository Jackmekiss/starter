import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { deleteAccountBuilder } from "../use-cases/account-deletion/delete-account";
import { updateAccountBuilder } from "../use-cases/account-modification/update-account";
import { retrieveAccountBuilder } from "../use-cases/account-retrieval/retrieve-account";
import { loginWithAppleBuilder } from "../use-cases/apple-login/login-with-apple";
import { loginWithGoogleBuilder } from "../use-cases/google-login/login-with-google";
import { loginBuilder } from "../use-cases/log-in/login";
import { logoutBuilder } from "../use-cases/log-out/logout";
import { completeOnboardingBuilder } from "../use-cases/onboarding-completion/complete-onboarding";
import { resetPasswordBuilder } from "../use-cases/password-reset-completion/reset-password";
import { requestPasswordResetBuilder } from "../use-cases/password-reset-request/request-password-reset";
import { registerBuilder } from "../use-cases/registration/register";

const authTagTypes: ["Auth"] = ["Auth"];

/** Builds RTK Query endpoint options for all authentication use-cases. */
export function createAuthAPIOptions(baseQuery: BaseQueryFn) {
  return {
    baseQuery,
    reducerPath: "authApi",
    tagTypes: authTagTypes,
    endpoints: (builder: EndpointBuilder<BaseQueryFn, "Auth", "authApi">) => ({
      ...retrieveAccountBuilder(builder),
      ...updateAccountBuilder(builder),
      ...completeOnboardingBuilder(builder),
      ...loginBuilder(builder),
      ...loginWithGoogleBuilder(builder),
      ...loginWithAppleBuilder(builder),
      ...registerBuilder(builder),
      ...requestPasswordResetBuilder(builder),
      ...resetPasswordBuilder(builder),
      ...logoutBuilder(builder),
      ...deleteAccountBuilder(builder),
    }),
  };
}
