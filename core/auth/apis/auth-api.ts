import { deleteAccountBuilder } from "@core/auth/use-cases/account-deletion/delete-account";
import { updateAccountBuilder } from "@core/auth/use-cases/account-modification/update-account";
import { retrieveAccountBuilder } from "@core/auth/use-cases/account-retrieval/retrieve-account";
import { loginWithAppleBuilder } from "@core/auth/use-cases/apple-login/login-with-apple";
import { loginWithGoogleBuilder } from "@core/auth/use-cases/google-login/login-with-google";
import { loginBuilder } from "@core/auth/use-cases/log-in/login";
import { logoutBuilder } from "@core/auth/use-cases/log-out/logout";
import { completeOnboardingBuilder } from "@core/auth/use-cases/onboarding-completion/complete-onboarding";
import { resetPasswordBuilder } from "@core/auth/use-cases/password-reset-completion/reset-password";
import { requestPasswordResetBuilder } from "@core/auth/use-cases/password-reset-request/request-password-reset";
import { registerBuilder } from "@core/auth/use-cases/registration/register";

import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";

const authTagTypes: ["Auth"] = ["Auth"];

/**
 * Builds RTK Query endpoint options for all authentication use-cases.
 */
export function createAuthApiOptions(baseQuery: BaseQueryFn) {
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
