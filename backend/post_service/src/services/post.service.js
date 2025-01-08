const bcrypt = require("bcrypt");
const Post = require("../models/post.model");

const getPostById = async (id) => {
  const post = await Post.findById(id);
  return post;
};

const getPosts = async () => {
  const posts = await Post.find();
  return posts;
};

const createPost = async (postData) => {
  const post = new Post(postData);
  await post.save();
  return post;
}

const updatePost = async (id, postData) => {
  const post = await Post.findByIdAndUpdate(id, postData, { new: true });
  return post;
}

const deletePost = async (id) => {
  await Post.findByIdAndDelete(id);
  return { message: "Post deleted successfully" };
}

const toggleLikePost = async (postId, user) => {
  const post = await getPostById(postId);
  post.likers = post.likers || [];

  const index = post.likers.indexOf(user.id);

  if (index > -1) {
    // Unlike the post
    post.likesCount = Math.max((post.likesCount || 0) - 1, 0);
    post.likers.splice(index, 1);
  } else {
    // Like the post
    post.likesCount = Math.max((post.likesCount || 0) + 1, 0);
    post.likers.push(user.id);
  }

  await post.save();
  return post;
};

const deleteComment = async (postId, commentId) => {
  const post = await getPostById(postId);
  post.comments = post.comments || [];

  const index = post.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );
  if (index > -1) {
    post.commentsCount = Math.max((post.commentsCount || 0) - 1, 0);
    post.comments.splice(index, 1);
    await post.save();
  }
  return post;
};

const addComment = async (postId, user, comment) => {
  const post = await getPostById(postId);
  post.comments = post.comments || [];

  post.commentsCount = Math.max((post.commentsCount || 0) + 1, 0);
  post.comments.push({ userId: user.id, comment: comment });
  await post.save();
  return post;
};

module.exports = { getPostById, getPosts, createPost, updatePost, deletePost, deleteComment, addComment, toggleLikePost };
