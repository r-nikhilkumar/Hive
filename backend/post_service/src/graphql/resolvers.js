const axios = require("axios");
const { getPosts, getPulse } = require("../services/post.service");

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
const getAllPulse = async (userLoader) => {
  const pulses = await getPulse();
  // console.log("pulses: ",pulses);

  const userIds = [
    ...new Set([
      ...pulses.map((pulse) => pulse.userId.toString()),
      ...pulses.flatMap((pulse) =>
        pulse.likes.likes.map((like) => like.userId.toString())
      ),
      ...pulses.flatMap((pulse) =>
        pulse.comments.comments.map((comment) => comment.userId.toString())
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

  const allPulses = pulses.map((pulse) => ({
    ...pulse,
    user: userMap[pulse.userId.toString()],
    likes: {
      likes: pulse.likes.likes.map((like) => ({
        ...like,
        user: userMap[like.userId.toString()],
      })),
    },
    comments: {
      comments: pulse.comments.comments.map((comment) => ({
        ...comment,
        user: userMap[comment.userId.toString()],
      })),
    },
  }));

  // console.log(allPulses);
  return allPulses;
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
    getPulseWithUser: async (_, __, { userLoader }) => {
      try {
        const posts = await getAllPulse(userLoader);
        return posts;
      } catch (error) {
        throw new Error("Failed to fetch posts");
      }
    },
  },
};

module.exports = resolvers;
