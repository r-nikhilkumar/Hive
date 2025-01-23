import { BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/users/auth`,
    credentials: "include", // Include credentials (cookies) in requests
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/sign-in",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response, _, error) => {
        if (error) {
          return {
            success: false,
            message: error?.data?.message || "An unexpected error occurred.",
          };
        }
        return {
          success: true,
          data: response,
        };
      },
    }),
    signUp: builder.mutation({
      query: (credentials) => ({
        url: "/sign-up",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response, _, error) => {
        if (error) {
          return {
            success: false,
            message: error?.data?.message || "An unexpected error occurred.",
          };
        }
        return {
          success: true,
          data: response,
        };
      },
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
