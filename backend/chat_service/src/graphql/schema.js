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

  type Attachment {
    name: String
    url: String
    type: String
  }

  input AttachmentInput {
    name: String
    url: String
    type: String
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
    attachments: [Attachment]
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
      attachments: [AttachmentInput]
    ): Message
  }
`;

module.exports = typeDefs;
