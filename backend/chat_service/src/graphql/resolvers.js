const axios = require("axios");
const {
  getMessagesByChatRoom,
  createMessage,
} = require("../services/chat.service");

const getUser = async (userId, userLoader) => {
  return await userLoader.load(userId);
};

const getMessages = async (chatRoomId) => {
  return await getMessagesByChatRoom(chatRoomId);
};

const getUsers = async (userIds, userLoader) => {
  return await userLoader.loadMany(userIds);
};

const getMessagesWithUser = async (chatRoomId, userLoader) => {
  const messages = await getMessages(chatRoomId);

  const userIds = [...new Set(messages.map(msg => msg.userId))];
  const users = await getUsers(userIds, userLoader);

  const userMap = users.reduce((acc, user) => {
    acc[user._id] = user;
    return acc;
  }, {});

  return messages.map(msg => ({
    ...msg._doc,
    user: userMap[msg.userId]
  }));
};

const resolvers = {
  Query: {
    getMessagesWithUser: async (_, { chatRoomId }, { userLoader }) => {
      try {
        return await getMessagesWithUser(chatRoomId, userLoader);
      } catch (error) {
        console.error("Error in getMessagesWithUser:", error);
        throw new Error("Failed to fetch messages with user info");
      }
    },
    user: async (_, { id }) => {
      try {
        const response = await axios.get(`http://localhost:3000/users/get-user/${id}`);
        return response.data.data;
      } catch (error) {
        console.error("Error in user query:", error);
        throw new Error("Failed to fetch user details");
      }
    },
  },
  Mutation: {
    createMessage: async (_, { chatRoomId, userId, message, attachments }, { userLoader }) => {
      try {
        const savedMessage = await createMessage(
          userId,
          chatRoomId,
          message,
          attachments
        );

        const user = await getUser(userId, userLoader);

        return { ...savedMessage._doc, user: user || null };
      } catch (error) {
        console.error("Error in createMessage:", error);
        throw new Error("Failed to create message with user info");
      }
    },
  },
};

module.exports = resolvers;
