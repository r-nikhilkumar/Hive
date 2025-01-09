const Chat = require("../models/chat.model");
const ChatRoom = require("../models/chatRoom.model");
const { getChatFromCache, cacheChat, removeChatFromCache, deleteChatRoomFromCache, getChatRoomsFromCache, cacheChatRooms, cacheChatRoom, getChatRoomFromCache } = require("../redis/chat.redis");

const createMessage = async (userId, chatRoomId, message, attachments = []) => {
  const chatRoom = await ChatRoom.findById(chatRoomId);
  if (!chatRoom) {
    throw new Error("Chat room not found");
  }

  const chatMessage = new Chat({
    userId,
    chatRoomId,
    message,
    attachments,
  });
  const savedMessage = await chatMessage.save();

  // Update cache
  await cacheChat(chatRoomId, savedMessage);

  return savedMessage;
};

const getMessagesByChatRoom = async (chatRoomId) => {
  const cachedMessages = await getChatFromCache(chatRoomId);
  if (cachedMessages) {
    return cachedMessages;
  }

  const messages = await Chat.find({ chatRoomId }).sort({ timestamp: 1 });
  if (messages.length) {
    await cacheChat(chatRoomId, messages);
  }
  return messages;
};

const deleteMessage = async (messageId) => {
  const message = await Chat.findById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }

  const chatRoom = await ChatRoom.findById(message.chatRoomId);
  if (!chatRoom) {
    throw new Error("Chat room not found");
  }

  await message.remove();

  // Update cache
  await removeChatFromCache(message.chatRoomId, messageId);

  return message;
};

const createChatRoom = async (roomName, roomAvatar, roomDescription, participants, type = "personal") => {
  if (type === "personal") {
    const existingRoom = await ChatRoom.findOne({
      type: "personal",
      participants: { $all: participants, $size: participants.length }
    });
    if (existingRoom) {
      return existingRoom;
    }
  }

  const chatRoom = new ChatRoom({
    roomName: type === "group" ? roomName : null,
    roomAvatar: type === "group" ? roomAvatar : null,
    roomDescription: type === "group" ? roomDescription : null,
    participants,
    type,
  });
  const savedChatRoom = await chatRoom.save();

  // Update cache
  await cacheChatRoom(savedChatRoom);

  return savedChatRoom;
};

const getChatRooms = async (userId) => {
  const cachedChatRooms = await getChatRoomsFromCache(userId);
  if (cachedChatRooms) {
    return cachedChatRooms;
  }

  const chatRooms = await ChatRoom.find({ participants: userId }).sort({ createdAt: -1 });

  // Enhance personal chat rooms with participant details
  const enhancedChatRooms = chatRooms.map((chatRoom) => {
    if (chatRoom.type === "personal") {
      const otherParticipant = chatRoom.participants.find(
        (participant) => participant.toString() !== userId
      );
      chatRoom.roomName = otherParticipant;
      chatRoom.roomAvatar = null;
      chatRoom.roomDescription = null;
    }
    return chatRoom;
  });

  await cacheChatRooms(userId, enhancedChatRooms);
  return enhancedChatRooms;
};

const deleteChatRoom = async (chatRoomId) => {
  const chatRoom = await ChatRoom.findById(chatRoomId);
  if (!chatRoom) {
    throw new Error("Chat room not found");
  }

  await Chat.deleteMany({ chatRoomId });
  await deleteChatRoomFromCache(chatRoomId); // Remove from cache
  await chatRoom.remove();

  return chatRoom;
};

module.exports = {
  createMessage,
  getMessagesByChatRoom,
  deleteMessage,
  createChatRoom,
  getChatRooms,
  deleteChatRoom,
};
