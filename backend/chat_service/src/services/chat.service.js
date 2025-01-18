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
    attachments: attachments.map((attachment) => ({
      name: attachment.name,
      type: attachment.type,
      url: attachment.url,
    })),
  });
  const savedMessage = await chatMessage.save();

  // Update cache
  await cacheChat(chatRoomId, savedMessage);

  return savedMessage;
};

const getMessagesByChatRoom = async (chatRoomId) => {
  // const cachedMessages = await getChatFromCache(chatRoomId);
  // if (cachedMessages) {
  //   return cachedMessages;
  // }

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

const createChatRoom = async (roomName, roomAvatar, roomDescription, participants, type = "personal", userId) => {
  if (type === "personal") {
    const existingRoom = await ChatRoom.findOne({
      type: "personal",
      participants: { $all: participants, $size: participants.length }
    });
    if (existingRoom) {
      return existingRoom;
    }
    // Set roomName as the other participant's ID
    const otherParticipant = participants.find(participant => participant.toString() !== userId);
    roomName = otherParticipant;
  }

  const chatRoom = new ChatRoom({
    roomName: roomName,
    roomAvatar: roomAvatar,
    roomDescription: roomDescription,
    participants,
    type,
  });
  const savedChatRoom = await chatRoom.save();
  await cacheChatRooms(userId, savedChatRoom);

  return savedChatRoom;
};

const getChatRooms = async (userId) => {
  // const cachedChatRooms = await getChatRoomsFromCache(userId);
  // if (cachedChatRooms) {
  //   return cachedChatRooms;
  // }

  const chatRooms = await ChatRoom.find({ participants: userId }).sort({ createdAt: -1 });
  await cacheChatRooms(userId, chatRooms);
  return chatRooms;
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
