const { gql } = require("apollo-server-express");

const GET_POSTS_WITH_USER = gql`
  query GetPostsWithUser {
    getPostsWithUser {
      _id
      userId
      description
      location
      tags
      date
      content
      content_type
      comments {
        comments {
          _id
          userId
          comment
          date
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
      commentsCount
      likes {
        likes {
          _id
          userId
          date
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
      likesCount
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

module.exports = {
  GET_POSTS_WITH_USER,
};
