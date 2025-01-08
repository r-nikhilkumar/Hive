const {
  getPostById,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  deleteComment,
  addComment,
  toggleLikePost,
} = require("../services/post.service");

const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user: user, message: "user sent" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getPostApi = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPostById(id);

    return res.status(200).json({ post: post, message: "post sent" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getPostsApi = async (req, res) => {
  try {
    const posts = await getPosts();
    return res.status(200).json({ posts: posts, message: "posts sent" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const createPostApi = async (req, res) => {
  try {
    const post = req.body;
    const user = req.user;
    const newPost = await createPost({ ...post, userId: user.id });

    return res.status(200).json({ post: newPost, message: "post created" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updatePostApi = async (req, res) => {
  try {
    const id = req.params.id;
    const post = req.body;
    const updatedPost = await updatePost(id, post);
    return res.status(200).json({ post: updatedPost, message: "post updated" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deletePostApi = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await deletePost(id);
    return res.status(200).json({ post: post, message: "post deleted" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const toggleLikePostApi = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user;

    const updatedPost = await toggleLikePost(postId, user);

    const message = updatedPost.likers.includes(user.id)
      ? "Post liked"
      : "Post unliked";

    return res.status(200).json({ post: updatedPost, message });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const toggleCommentApi = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    if (commentId) {
      // Delete comment
      const updatedPost = await deleteComment(postId, commentId);
      return res
        .status(200)
        .json({ post: updatedPost, message: "Comment deleted" });
    }

    // Add comment
    const comment = req.body.comment;
    const user = req.user;
    const updatedPost = await addComment(postId, user, comment);
    return res
      .status(200)
      .json({ post: updatedPost, message: "Comment added" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getUser,
  getPostApi,
  getPostsApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  toggleLikePostApi,
  toggleCommentApi,
};
