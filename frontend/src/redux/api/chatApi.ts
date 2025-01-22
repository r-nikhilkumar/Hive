import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/chats",
    credentials: "include",
  }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getChatRooms: builder.query({
      query: () => "/rooms",
      providesTags: ["Chat"],
    }),
    getMessagesByChatRoom: builder.query({
      query: (chatRoomId) => `/rooms/${chatRoomId}/messages`,
    }),
    createMessage: builder.mutation({
      query: (messageData) => ({
        url: "/messages",
        method: "POST",
        body: messageData,
      }),
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
    }),
    createChatRoom: builder.mutation({
      query: (chatRoomData) => ({
        url: "/rooms",
        method: "POST",
        body: chatRoomData,
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChatRoom: builder.mutation({
      query: (chatRoomId) => ({
        url: `/rooms/${chatRoomId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useGetMessagesByChatRoomQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useCreateChatRoomMutation,
  useDeleteChatRoomMutation,
} = chatApi;
