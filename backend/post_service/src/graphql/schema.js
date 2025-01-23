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

  type CommentDetail {
    _id: ID!
    userId: ID!
    comment: String!
    date: String!
    user: User
  }

  type Comment {
    comments: [CommentDetail]
  }

  type LikeDetail {
    _id: ID!
    userId: ID!
    date: String!
    user: User
  }

  type Like {
    likes: [LikeDetail]
  }

  type Post {
    _id: ID!
    userId: ID!
    description: String!
    location: String
    tags: [String]
    date: String!
    content: [String]
    content_type: String
    comments: Comment
    commentsCount: Int
    likes: Like
    likesCount: Int
    createdAt: String!
    updatedAt: String!
    user: User
  }

  input PostInput {
    description: String!
    location: String
    tags: [String]
    content: [String]
    content_type: String
  }

  type Query {
    getPostsWithUser: [Post]
  }

  type Mutation {
    updatePost(postId: ID!, postData: PostInput!): Post
  }
`;

module.exports = typeDefs;
