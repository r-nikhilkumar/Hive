const {
  createMessage,
  getMessagesByChatRoom,
  deleteMessage,
  createChatRoom,
  getChatRooms,
  deleteChatRoom,
} = require("../services/chat.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getChatRoomsApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatRooms = await getChatRooms(userId);
    return res.status(200).json(ApiResponse.success(chatRooms, "Chat rooms sent"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to fetch chat rooms", error.message));
  }
};

const createChatRoomApi = async (req, res) => {
  try {
    const { roomName, roomAvatar, roomDescription, participants, type } = req.body;
    const chatRoom = await createChatRoom(roomName, roomAvatar, roomDescription, [...participants, req.user.id], type);
    return res.status(201).json(ApiResponse.success(chatRoom, "Chat room created"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to create chat room", error.message));
  }
};

const getMessagesByChatRoomApi = async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    const messages = await getMessagesByChatRoom(chatRoomId);
    return res.status(200).json(ApiResponse.success(messages, "Messages sent"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to fetch messages", error.message));
  }
};

const createMessageApi = async (req, res) => {
  try {
    const { chatRoomId, message, attachments } = req.body;
    const userId = req.user.id;
    const newMessage = await createMessage(userId, chatRoomId, message, attachments);
    return res.status(201).json(ApiResponse.success(newMessage, "Message created"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to create message", error.message));
  }
};

const deleteMessageApi = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await deleteMessage(messageId);
    return res.status(200).json(ApiResponse.success(message, "Message deleted"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to delete message", error.message));
  }
};

const deleteChatRoomApi = async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    const chatRoom = await deleteChatRoom(chatRoomId);
    return res.status(200).json(ApiResponse.success(chatRoom, "Chat room deleted"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to delete chat room", error.message));
  }
};

module.exports = {
  getChatRoomsApi,
  createChatRoomApi,
  getMessagesByChatRoomApi,
  createMessageApi,
  deleteMessageApi,
  deleteChatRoomApi,
};
