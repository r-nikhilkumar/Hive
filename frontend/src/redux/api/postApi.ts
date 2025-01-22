import { BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ...existing code...

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/posts`,
    credentials: "include",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/get-posts",
      providesTags: ["Post"],
    }),
    getPostById: builder.query({
      query: (postId) => `/get-post/${postId}`,
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/create-post",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: ({ postData, postId }) => ({
        url: `/update-post/${postId}`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/delete-post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    toggleLike: builder.mutation({
      query: ({postId, userId}) => ({
        url: `/toggle-like/${postId}`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
      onQueryStarted: async ({postId, userId}, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.data.find((post) => post._id === postId);
            if (post) {
              post.likesCount += post.likes.likes.some((like) => like.userId === userId) ? -1 : 1;
              post.likes.likes = post.likes.likes.some((like) => like.userId === userId)
                ? post.likes.likes.filter((like) => like.userId !== userId)
                : [...post.likes.likes, { userId }];
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// ...existing code...

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikeMutation,
} = postApi;
