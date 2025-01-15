import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import io from 'socket.io-client';

const socket = io('http://localhost:3003', {
  withCredentials: true,
  
});

export const cacheMessages = (chatRoomId, messages) => {
  localStorage.setItem(`chat_${chatRoomId}`, JSON.stringify(messages));
};

export const getCachedMessages = (chatRoomId) => {
  const cached = localStorage.getItem(`chat_${chatRoomId}`);
  return cached ? JSON.parse(cached) : null;
};

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/chats', credentials: 'include' }),
  endpoints: (builder) => ({
    getChatRooms: builder.query({
      query: () => '/rooms',
    }),
    getMessagesByChatRoom: builder.query({
      query: (chatRoomId) => `/rooms/${chatRoomId}/messages`,
    }),
    createMessage: builder.mutation({
      query: (messageData) => ({
        url: '/messages',
        method: 'POST',
        body: messageData,
      }),
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
    }),
    createChatRoom: builder.mutation({
      query: (chatRoomData) => ({
        url: '/rooms',
        method: 'POST',
        body: chatRoomData,
      }),
    }),
    deleteChatRoom: builder.mutation({
      query: (chatRoomId) => ({
        url: `/rooms/${chatRoomId}`,
        method: 'DELETE',
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
  socket.emit('initializeChatRoom', { chatRoomId });
};

export const joinRoom = (chatRoomId) => {
  const cachedMessages = getCachedMessages(chatRoomId);
  if (cachedMessages) {
    receivePreviousMessages((messages) => {
      cacheMessages(chatRoomId, messages);
    });
  }
  socket.emit('joinRoom', { chatRoomId });
};

export const leaveRoom = (chatRoomId) => {
  socket.emit('leaveRoom', { chatRoomId });
};

export const sendMessage = (chatRoomId, message, attachments = []) => {
  const formattedAttachments = attachments.map((attachment) => ({
    name: attachment.name,
    type: attachment.type,
    url: attachment.url,
  }));
  socket.emit('message', { chatRoomId, message, attachments: formattedAttachments });
};

export const receiveMessage = (callback) => {
  socket.off('message').on('message', callback); // Ensure only one listener
};

export const receivePreviousMessages = (callback) => {
  socket.off('previousMessages').on('previousMessages', callback); // Ensure only one listener
};

export const receiveMessageReceived = (callback) => {
  socket.off('messageReceived').on('messageReceived', callback); // Ensure only one listener
};
