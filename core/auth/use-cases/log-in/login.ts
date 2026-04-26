import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { AuthResult, LoginPayload } from "../../apis/types";
import { setAuth, setError, setLoading } from "../../domain/slice";

export const loginBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">
) => ({
  login: build.mutation<AuthResult, LoginPayload>({
    query: (payload) => ({
      url: "/login",
      method: "POST",
      body: payload
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
