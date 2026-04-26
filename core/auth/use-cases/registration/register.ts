import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import { AuthResult, RegisterPayload } from "../../apis/types";
import { setAuth, setError, setLoading } from "../../domain/slice";

export const registerBuilder = (
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">
) => ({
  register: build.mutation<AuthResult, RegisterPayload>({
    query: (payload) => ({
      url: "/register",
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
