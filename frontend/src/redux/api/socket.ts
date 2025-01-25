import io from "socket.io-client";
import { getTokenFromLocalStorage } from "@/utils/auth";
import { CHAT_URL } from "@/constants";

let socket: any = null;

export const connectSocket = () => {
  if (!socket) {
    const token = getTokenFromLocalStorage();
    socket = io(CHAT_URL, {
      withCredentials: true,
      reconnection: true,
      auth: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  }
  return socket;
};

export const initializeChatRoom = (chatRoomId:any) => {
  if (socket) socket.emit("initializeChatRoom", { chatRoomId });
};

export const joinRoom = (chatRoomId:any) => {
  if (socket) socket.emit("joinRoom", { chatRoomId });
};

export const leaveRoom = (chatRoomId:any) => {
  if (socket) socket.emit("leaveRoom", { chatRoomId });
};

export const sendMessage = (chatRoomId:any, message:any, attachments:any = []) => {
  const formattedAttachments = attachments.map((attachment:any) => ({
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

export const receiveMessage = (callback:any) => {
  if (socket) socket.off("message").on("message", callback); // Ensure only one listener
};

export const receivePreviousMessages = (callback:any) => {
  if (socket) socket.off("previousMessages").on("previousMessages", (messages:any) => {
    const formattedMessages = messages.map((msg:any) => ({
      ...msg,
      user: {
        _id: msg.user._id,
        name: msg.user.name,
        email: msg.user.email,
        username: msg.user.username,
        profilePic: msg.user.profilePic,
        bio: msg.user.bio
      }
    }));
    callback(formattedMessages);
  });
};

export const receiveMessageReceived = (callback:any) => {
  if (socket) socket.off("messageReceived").on("messageReceived", callback); // Ensure only one listener
};

export const cacheMessages = (chatRoomId:any, messages:any) => {
  localStorage.setItem(`chatRoom_${chatRoomId}_messages`, JSON.stringify(messages));
};

export const getCachedMessages = (chatRoomId:any) => {
  const cachedMessages = localStorage.getItem(`chatRoom_${chatRoomId}_messages`);
  return cachedMessages ? JSON.parse(cachedMessages) : [];
};

export const deleteMessage = (messageId:any) => {
  if (socket) socket.emit("deleteMessage", { messageId });
};

export const receiveMessageDeleted = (callback:any) => {
  if (socket) socket.off("messageDeleted").on("messageDeleted", callback); // Ensure only one listener
};
