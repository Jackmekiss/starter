import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { AuthResult } from "../../apis/types";
import { setAuth, setError, setLoading } from "../../domain/slice";

export const loginWithGoogleBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) => ({
  loginWithGoogle: build.mutation<AuthResult, void>({
    query: () => ({
      url: "/login/google",
      method: "POST",
      body: undefined,
      params: undefined,
    }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      dispatch(setLoading());

      const { data } = await queryFulfilled;

      if (data.success) {
        dispatch(setAuth(data));
        return;
      }

      dispatch(setError(data.error));
    },
  }),
});
