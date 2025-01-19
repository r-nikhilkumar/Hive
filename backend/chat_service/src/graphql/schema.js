const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    profilePic: String
    bio: String
  }

  type ChatRoom {
    _id: ID!
    roomName: String!
    roomAvatar: String
    roomDescription: String
    participants: [User]
    type: String!
    createdAt: String!
    updatedAt: String!
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
    getMessagesWithUser(chatRoomId: ID!): [Message]
    getChatRooms(userId: ID!): [ChatRoom]
  }

  type Mutation {
    createMessage(
      chatRoomId: ID!
      userId: ID!
      message: String!
      attachments: [String]
    ): Message
  }
`;

module.exports = typeDefs;
