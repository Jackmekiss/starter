import { fakeBaseQuery } from "@reduxjs/toolkit/query";

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

import type { AuthApiBaseQueryFn } from "@core/auth/apis/auth-api-base-query";
import type { AuthError } from "@core/auth/domain/auth-error";
import type { AuthGateway } from "@core/auth/gateways/auth-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/**
 * Builds RTK Query endpoint options for all authentication use-cases.
 */
export function createAuthApiOptions(authGateway: AuthGateway) {
  return {
    baseQuery: fakeBaseQuery<AuthError>(),
    reducerPath: "authApi",
    endpoints: (
      builder: EndpointBuilder<AuthApiBaseQueryFn, never, "authApi">,
    ) => ({
      ...retrieveAccountBuilder(builder, authGateway),
      ...updateAccountBuilder(builder, authGateway),
      ...completeOnboardingBuilder(builder, authGateway),
      ...loginBuilder(builder, authGateway),
      ...loginWithGoogleBuilder(builder, authGateway),
      ...loginWithAppleBuilder(builder, authGateway),
      ...registerBuilder(builder, authGateway),
      ...requestPasswordResetBuilder(builder, authGateway),
      ...resetPasswordBuilder(builder, authGateway),
      ...logoutBuilder(builder, authGateway),
      ...deleteAccountBuilder(builder, authGateway),
    }),
  };
}
