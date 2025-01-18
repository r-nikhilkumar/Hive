const { ApolloServer, gql } = require("apollo-server-express");
const axios = require("axios");
const {
  getMessagesByChatRoom,
  createMessage,
} = require("../services/chat.service");

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    profilePic: String
    bio: String
  }

  type Message {
    _id: ID!
    chatRoomId: ID!
    userId: ID!
    message: String!
    status: String!
    attachments: [String]
    createdAt: String!
    timestamp: String!
    updatedAt: String!
    user: User
  }

  type Query {
    getMessagesWithUser(chatRoomId: ID!, token: String!): [Message]
    user(id: ID!): User
  }

  type Mutation {
    createMessage(
      chatRoomId: ID!
      userId: ID!
      message: String!
      attachments: [String]
      token: String!
    ): Message
  }
`;

const resolvers = {
  Query: {
    getMessagesWithUser: async (_, { chatRoomId, token }) => {
      try {
        const messages = await getMessagesByChatRoom(chatRoomId);
        console.log(messages)

        const userIds = [...new Set(messages.map(msg => msg.userId))];
        console.log(userIds)
        const userPromises = userIds
          .filter(userId => userId) // Ensure userId is defined
          .map(userId => 
            axios.get(`http://localhost:3000/users/get-user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          );

        const users = await Promise.all(userPromises);
        const userMap = users.reduce((acc, userResponse) => {
          acc[userResponse.data.data._id] = userResponse.data.data;
          return acc;
        }, {});

        const messagesWithUser = messages.map(msg => ({
          ...msg._doc,
          user: userMap[msg.userId]
        }));

        return messagesWithUser;
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
    createMessage: async (_, { chatRoomId, userId, message, attachments, token }) => {
      try {
        const savedMessage = await createMessage(
          userId,
          chatRoomId,
          message,
          attachments
        );

        const response = await axios.get(
          `http://localhost:3000/users/get-user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const user = response.data.data;

        return { ...savedMessage._doc, user: user || null };
      } catch (error) {
        console.error("Error in createMessage:", error);
        throw new Error("Failed to create message with user info");
      }
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  introspection: true, // Enable introspection for the playground
  playground: true, // Enable the playground
});

module.exports = apolloServer;
