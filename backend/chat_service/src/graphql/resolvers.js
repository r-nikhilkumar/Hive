const axios = require("axios");
const {
  getMessagesByChatRoom,
  createMessage,
  getChatRooms,
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

  const userIds = [...new Set(messages.map((msg) => msg.userId))];
  const users = await getUsers(userIds, userLoader);

  const userMap = users.reduce((acc, user) => {
    if (user && user._id) {
      acc[user._id] = user;
    }
    return acc;
  }, {});

  return messages.map((msg) => ({
    ...msg._doc,
    user: userMap[msg.userId],
  }));
};

const getChatRoomsWithUsers = async (userId, userLoader) => {
  const chatRooms = await getChatRooms(userId);

  for (let index = 0; index < chatRooms.length; index++) {
    const chatRoom = chatRooms[index];

    const participantIds = chatRoom.participants.filter(
      (participantId) => participantId.toString() !== userId.toString()
    );

    const participants = await getUsers(participantIds, userLoader);

    // console.log("Participants fetched for chatRoom:", participants);
    // console.log("ChatRoom before assignment:", chatRoom);

    chatRooms[index] = {
      ...chatRoom._doc,
      participants: [...participants],
      ...(chatRoom.type === "personal" && participants.length > 0
        ? {
            roomAvatar: participants[0]?.profilePic,
            roomDescription: participants[0]?.bio,
            roomName: participants[0]?.name
          }
        : {}),
    };
  }

//   console.log("Updated chatRooms:", chatRooms);
  return chatRooms;
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
    getChatRooms: async (_, { userId }, { userLoader }) => {
      try {
        return await getChatRoomsWithUsers(userId, userLoader);
      } catch (error) {
        console.error("Error in getChatRooms:", error);
        throw new Error("Failed to fetch chat rooms with user info");
      }
    },
  },
  Mutation: {
    createMessage: async (
      _,
      { chatRoomId, userId, message, attachments },
      { userLoader }
    ) => {
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
