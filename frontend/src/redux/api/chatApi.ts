import { BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenFromLocalStorage } from "@/utils/auth";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/chats`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getTokenFromLocalStorage();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
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
