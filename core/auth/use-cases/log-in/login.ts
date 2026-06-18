import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { AuthResult, LoginPayload } from "../../apis/types";
import { setAuth, setError, setLoading } from "../../domain/slice";

export function loginBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) {
  return {
    login: build.mutation<AuthResult, LoginPayload>({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
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
  };
}
