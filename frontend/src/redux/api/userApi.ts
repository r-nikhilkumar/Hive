import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/users', credentials: 'include' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/',
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
