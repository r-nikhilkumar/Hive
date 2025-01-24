// // /cache/postCache.js
// const redisClient = require("../../../config/redis");

// const getChatFromCache = async (chatRoomId) => {
//   const cachedChat = await redisClient.lrange(`chat:${chatRoomId}`, 0, -1);
//   return cachedChat.length ? cachedChat.map(JSON.parse) : null;
// };

// const cacheChat = async (chatRoomId, chatMessage) => {
//   await redisClient.rpush(`chat:${chatRoomId}`, JSON.stringify(chatMessage));
// };

// const removeChatFromCache = async (chatRoomId, messageId) => {
//   const cachedChat = await getChatFromCache(chatRoomId);
//   if (cachedChat) {
//     const updatedChat = cachedChat.filter(msg => msg._id !== messageId);
//     await redisClient.del(`chat:${chatRoomId}`);
//     if (updatedChat.length) {
//       await redisClient.rpush(`chat:${chatRoomId}`, ...updatedChat.map(JSON.stringify));
//     }
//   }
// };

// const deleteChatRoomFromCache = async (chatRoomId) => {
//   await redisClient.del(`chat:${chatRoomId}`);
// };

// const getChatRoomsFromCache = async (userId) => {
//   const cachedChatRooms = await redisClient.get(`chatRooms:${userId}`);
//   return cachedChatRooms ? JSON.parse(cachedChatRooms) : null;
// };

// const cacheChatRooms = async (userId, chatRooms) => {
//   await redisClient.set(`chatRooms:${userId}`, JSON.stringify(chatRooms), 'EX', 3600); // Cache for 1 hour
// };

// const cacheChatRoom = async (chatRoom) => {
//   await redisClient.set(`chatRoom:${chatRoom._id}`, JSON.stringify(chatRoom), 'EX', 3600); // Cache for 1 hour
// };

// const getChatRoomFromCache = async (chatRoomId) => {
//   const cachedChatRoom = await redisClient.get(`chatRoom:${chatRoomId}`);
//   return cachedChatRoom ? JSON.parse(cachedChatRoom) : null;
// };

// module.exports = { getChatFromCache, cacheChat, removeChatFromCache, deleteChatRoomFromCache, getChatRoomsFromCache, cacheChatRooms, cacheChatRoom, getChatRoomFromCache };
