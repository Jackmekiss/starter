import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { deleteAccountBuilder } from "../use-cases/account-deletion/deleteAccount";
import { updateAccountBuilder } from "../use-cases/account-modification/updateAccount";
import { retrieveAccountBuilder } from "../use-cases/account-retrieval/retrieveAccount";
import { loginWithAppleBuilder } from "../use-cases/apple-login/loginWithApple";
import { loginWithGoogleBuilder } from "../use-cases/google-login/loginWithGoogle";
import { loginBuilder } from "../use-cases/log-in/login";
import { logoutBuilder } from "../use-cases/log-out/logout";
import { completeOnboardingBuilder } from "../use-cases/onboarding-completion/completeOnboarding";
import { resetPasswordBuilder } from "../use-cases/password-reset-completion/resetPassword";
import { requestPasswordResetBuilder } from "../use-cases/password-reset-request/requestPasswordReset";
import { registerBuilder } from "../use-cases/registration/register";

export const createAuthAPIOptions = (baseQuery: BaseQueryFn) => ({
  baseQuery,
  reducerPath: "authAPI",
  tagTypes: ["Auth"] as const,
  endpoints: (builder: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">) => ({
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
});
