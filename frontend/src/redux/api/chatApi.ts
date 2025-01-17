import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import io from "socket.io-client";

let socket = null;
export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3003", {
      withCredentials: true,
      reconnection: true,
    });
  }
  return socket;
};

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/chats",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getChatRooms: builder.query({
      query: () => "/rooms",
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
    }),
    deleteChatRoom: builder.mutation({
      query: (chatRoomId) => ({
        url: `/rooms/${chatRoomId}`,
        method: "DELETE",
      }),
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

export const initializeChatRoom = (chatRoomId) => {
  if (socket) socket.emit("initializeChatRoom", { chatRoomId });
};

export const joinRoom = (chatRoomId) => {
  if (socket) socket.emit("joinRoom", { chatRoomId });
};

export const leaveRoom = (chatRoomId) => {
  if (socket) socket.emit("leaveRoom", { chatRoomId });
};

export const sendMessage = (chatRoomId, message, attachments = []) => {
  const formattedAttachments = attachments.map((attachment) => ({
    name: attachment.name,
    type: attachment.type,
    url: attachment.url,
  }));
  if (socket)
    socket.emit("message", {
      chatRoomId,
      message,
      attachments: formattedAttachments,
    });
};

export const receiveMessage = (callback) => {
  if (socket) socket.off("message").on("message", callback); // Ensure only one listener
};

export const receivePreviousMessages = (callback) => {
  if (socket) socket.off("previousMessages").on("previousMessages", (messages) => {
    const formattedMessages = messages.map(msg => ({
      ...msg,
      user: {
        id: msg.user.id,
        name: msg.user.name,
        email: msg.user.email
      }
    }));
    callback(formattedMessages);
  });
};

export const receiveMessageReceived = (callback) => {
  if (socket) socket.off("messageReceived").on("messageReceived", callback); // Ensure only one listener
};

export const cacheMessages = (chatRoomId, messages) => {
  localStorage.setItem(`chatRoom_${chatRoomId}_messages`, JSON.stringify(messages));
};

export const getCachedMessages = (chatRoomId) => {
  const cachedMessages = localStorage.getItem(`chatRoom_${chatRoomId}_messages`);
  return cachedMessages ? JSON.parse(cachedMessages) : [];
};

export const deleteMessage = (messageId) => {
  if (socket) socket.emit("deleteMessage", { messageId });
};

export const receiveMessageDeleted = (callback) => {
  if (socket) socket.off("messageDeleted").on("messageDeleted", callback); // Ensure only one listener
};
