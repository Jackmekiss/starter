import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { UpdateAccountPayload } from "../../apis/types";
import { Account } from "../../domain/account";
import { setAccount } from "../../domain/slice";

export const completeOnboardingBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">
) => ({
  completeOnboarding: build.mutation<Account, void>({
    query: () => ({
      url: "/update",
      method: "POST",
      body: {
        onboardingStatus: "completed"
      } satisfies UpdateAccountPayload
    }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      const { data } = await queryFulfilled;

      dispatch(setAccount(data));
    }
  })
});
