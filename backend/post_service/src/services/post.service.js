const Post = require("../models/post.model");
const Comment = require("../models/comments.model");
const Like = require("../models/likes.model");

const getPostById = async (id) => {
  const post = await Post.findById(id)
    .select("-__v")
    .populate({ path: "comments", select: "-postId -_id -__v", options: { lean: true } })
    .populate({ path: "likes", select: "-postId -_id -__v", options: { lean: true } })
    .select("-postId");
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const getPosts = async () => {
  const posts = await Post.find()
    .select("-__v")
    .populate({ path: "comments", select: "-postId -_id -__v", options: { lean: true } }).lean()
    .populate({ path: "likes", select: "-postId -_id -__v", options: { lean: true } }).lean();
    // console.log("service: ",posts.likes);
  return posts;
};

const createPost = async (postData) => {
  try {
    const post = new Post(postData);
    const commentDoc = new Comment({ postId: post._id, comments: [] });
    post.comments = commentDoc._id;
    const getPostLike = new Like({ postId: post._id, likes: [] });
    post.likes = getPostLike._id;
    commentDoc.save();
    getPostLike.save();
    await post.save();
    return post;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (id, postData) => {
  const post = await Post.findByIdAndUpdate(id, postData, { new: true });
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const deletePost = async (id) => {
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    throw new Error("Post not found");
  }
  await Comment.findOneAndDelete({ postId: id });
  await Like.findOneAndDelete({ postId: id });
  return {
    message: "Post and associated likes and comments deleted successfully",
  };
};

const toggleLikePost = async (postId, user) => {
  const post = await getPostById(postId);

  let getPostLike = await Like.findOne({ postId });

  if (!getPostLike) {
    getPostLike = new Like({ postId, likes: [] });
    post.likes = getPostLike._id;
  }

  const userIndex = getPostLike.likes.findIndex((like) =>
    like.userId.equals(user.id)
  );

  if (userIndex > -1) {
    getPostLike.likes.splice(userIndex, 1);
    post.likesCount = Math.max((post.likesCount || 0) - 1, 0);
  } else {
    getPostLike.likes.push({ userId: user.id });
    post.likesCount = Math.max((post.likesCount || 0) + 1, 0);
  }

  await getPostLike.save();
  await post.save();

  return await getPostById(postId);
};

const deleteComment = async (postId, commentId) => {
  const post = await getPostById(postId);
  const commentDoc = await Comment.findOne({ postId });

  if (commentDoc) {
    const commentIndex = commentDoc.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex > -1) {
      commentDoc.comments.splice(commentIndex, 1);
      post.commentsCount = Math.max((post.commentsCount || 0) - 1, 0);
      await commentDoc.save();
    } else {
      throw new Error("Comment not found");
    }
  } else {
    throw new Error("Comments not found for this post");
  }

  await post.save();
  return await getPostById(postId);
};

const addComment = async (postId, user, comment) => {
  const post = await getPostById(postId);
  let commentDoc = await Comment.findOne({ postId });

  if (!commentDoc) {
    commentDoc = new Comment({ postId, comments: [] });
    post.comments = commentDoc._id;
  }

  commentDoc.comments.push({ userId: user.id, comment });
  post.commentsCount = Math.max((post.commentsCount || 0) + 1, 0);

  await commentDoc.save();
  await post.save();
  return await getPostById(postId);
};

module.exports = {
  getPostById,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  deleteComment,
  addComment,
  toggleLikePost,
};
