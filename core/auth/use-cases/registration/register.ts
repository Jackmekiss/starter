import type { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import type { AuthResult, RegisterPayload } from "../../apis/types";
import { setAuth, setError, setLoading } from "../../domain/slice";

export function registerBuilder(
  build: EndpointBuilder<BaseQueryFn, "Auth", "authAPI">,
) {
  return {
    register: build.mutation<AuthResult, RegisterPayload>({
      query: (payload) => ({
        url: "/register",
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
