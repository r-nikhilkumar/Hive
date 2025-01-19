const { gql } = require("apollo-server-express");

const GET_MESSAGES_WITH_USER = gql`
  query GetMessagesWithUser($chatRoomId: ID!) {
    getMessagesWithUser(chatRoomId: $chatRoomId) {
      _id
      chatRoomId
      userId
      message
      status
      attachments
      createdAt
      timestamp
      updatedAt
      user {
        _id
        name
        username
        email
        profilePic
        bio
      }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $chatRoomId: ID!
    $userId: ID!
    $message: String!
    $attachments: [String]
  ) {
    createMessage(
      chatRoomId: $chatRoomId
      userId: $userId
      message: $message
      attachments: $attachments
    ) {
      _id
      chatRoomId
      userId
      message
      status
      attachments
      createdAt
      timestamp
      updatedAt
      user {
        _id
        name
        username
        email
        profilePic
        bio
      }
    }
  }
`;

const GET_CHAT_ROOMS = gql`
  query GetChatRooms($userId: ID!) {
    getChatRooms(userId: $userId) {
      _id
      roomName
      roomAvatar
      roomDescription
      participants {
        _id
        name
        username
        email
        profilePic
        bio
      }
      type
      createdAt
      updatedAt
    }
  }
`;

module.exports = {
  GET_MESSAGES_WITH_USER,
  CREATE_MESSAGE,
  GET_CHAT_ROOMS,
};
