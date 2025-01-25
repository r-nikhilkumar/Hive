const axios = require("axios");
const { getPostsApi } = require("../controllers/post.controller");
const { getPosts } = require("../services/post.service");

const getUser = async (userId, userLoader) => {
  return await userLoader.load(userId);
};

const getUsers = async (userIds, userLoader) => {
  return await userLoader.loadMany(userIds);
};

const getAllPosts = async (userLoader) => {
  const posts = await getPosts();
  // console.log("Posts: ",posts);

  const userIds = [
    ...new Set([
      ...posts.map((post) => post.userId.toString()),
      ...posts.flatMap((post) =>
        post.likes.likes.map((like) => like.userId.toString())
      ),
      ...posts.flatMap((post) =>
        post.comments.comments.map((comment) => comment.userId.toString())
      ),
    ]),
  ];

  // console.log("UserIds: ",userIds);

  const users = await getUsers(userIds, userLoader);
  // console.log("Users: ",users);

  const userMap = users.reduce((acc, user) => {
    if (user && user._id) {
      acc[user._id.toString()] = user;
    }
    return acc;
  }, {});

  const allPosts = posts.map((post) => ({
    ...post,
    user: userMap[post.userId.toString()],
    likes: {
      likes: post.likes.likes.map((like) => ({
        ...like,
        user: userMap[like.userId.toString()],
      })),
    },
    comments: {
      comments: post.comments.comments.map((comment) => ({
        ...comment,
        user: userMap[comment.userId.toString()],
      })),
    },
  }));

  // console.log(allPosts);
  return allPosts;
};

const resolvers = {
  Query: {
    getPostsWithUser: async (_, __, { userLoader }) => {
      try {
        const posts = await getAllPosts(userLoader);
        return posts;
      } catch (error) {
        throw new Error("Failed to fetch posts");
      }
    },
  },
};

module.exports = resolvers;
