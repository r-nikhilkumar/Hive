const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    profilePic: String
    bio: String
    location: String
    website: String
    socialLinks: [SocialLink]
  }

  type SocialLink {
    platform: String
    url: String
  }

  type Post {
    id: ID!
    userId: String!
    user: User
    title: String!
    description: String!
    content_type: String!
    content: [String]
    date: String
    comments: [Comment]
    commentsCount: Int
    likers: [String]
    likesCount: Int
  }

  type Comment {
    id: ID!
    userId: String!
    comment: String!
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
    getPost(id: ID!): Post
    getPosts: [Post]
  }

  

  input SocialLinkInput {
    platform: String
    url: String
  }
`;

module.exports = typeDefs;


// type Mutation {
//     register(name: String!, username: String!, email: String!, password: String!): AuthPayload
//     login(email: String, username: String, password: String!): AuthPayload
//     updateUser(id: ID!, name: String, username: String, email: String, profilePic: String, bio: String, location: String, website: String, socialLinks: [SocialLinkInput]): User
//     createPost(userId: String!, title: String!, description: String!, content_type: String!, content: [String]): Post
//     updatePost(id: ID!, title: String, description: String, content: [String]): Post
//     deletePost(id: ID!): Post
//     toggleLikePost(id: ID!): Post
//     toggleComment(postId: ID!, commentId: ID, comment: String): Post
//     logout: Boolean
//   }
