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
