import { BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
