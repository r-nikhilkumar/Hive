const axios = require('axios');

const resolvers = {
  Query: {
    getPosts: async () => {
      // Fetch posts from the Post microservice
      const postsResponse = await axios.get("http://localhost:3002/posts");
      return postsResponse.data;
    },
    getPostById: async (_, { id }) => {
      // Fetch a single post by ID from the Post microservice
      const postResponse = await axios.get(`http://localhost:3002/posts/${id}`);
      return postResponse.data;
    },
    getAllPosts: async () => {
      // Fetch all posts from the Post microservice
      const allPostsResponse = await axios.get("http://localhost:3002/posts");
      return allPostsResponse.data;
    },
  },
  Post: {
    user: async (post) => {
      // Fetch user details from the User microservice
      const userResponse = await axios.get(`http://localhost:3001/users/${post.userId}`);
      return userResponse.data;
    },
    comments: async (post) => {
      // Fetch comments for the post
      const commentsResponse = await axios.get(`http://localhost:3002/comments/${post._id}`);
      return commentsResponse.data;
    },
    likes: async (post) => {
      // Fetch likes for the post
      const likesResponse = await axios.get(`http://localhost:3002/likes/${post._id}`);
      return likesResponse.data;
    },
  },
};

module.exports = resolvers;