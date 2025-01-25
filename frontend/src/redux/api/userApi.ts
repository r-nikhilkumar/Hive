import { getTokenFromLocalStorage } from "@/utils/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/users",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getTokenFromLocalStorage();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/",
    }),
    getUsersWithIds: builder.mutation({
      query: (body) => ({
        url: "/get-users",
        method: "POST",
        body:{ids: body},
      }),
    }),
    getUserById: builder.query({
      query: (id) => `/get-user/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUsersWithIdsMutation } = userApi;
