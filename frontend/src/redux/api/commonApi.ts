import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    uploadFiles: builder.mutation({
        query: (formData) => ({
          url: "/upload",
          method: "POST",
          body: formData,
        }),
      }),
  }),
});

export const {
  useUploadFilesMutation
} = commonApi;
