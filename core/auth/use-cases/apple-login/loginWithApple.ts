import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { AuthResult } from "../../apis/types";
import { setAuth, setError, setLoading } from "../../domain/slice";

export const loginWithAppleBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">
) => ({
  loginWithApple: build.mutation<AuthResult, void>({
    query: () => ({
      url: "/login/apple",
      method: "POST",
      body: undefined,
      params: undefined
    }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      dispatch(setLoading());

      const { data } = await queryFulfilled;

      if (data.success) {
        dispatch(setAuth(data));
        return;
      }

      dispatch(setError(data.error));
    }
  })
});
