const axios = require('axios');

const resolvers = {
  Query: {
    getPosts: async () => {
      // Fetch posts from the Post microservice
      const postsResponse = await axios.get("http://localhost:3002/posts");
      return postsResponse.data;
    },
  },
  Post: {
    user: async (post) => {
      // Fetch user details from the User microservice
      const userResponse = await axios.get(`http://localhost:3001/users/${post.userId}`);
      return userResponse.data;
    },
  },
};

module.exports = resolvers;