const { apolloServer, createUserLoader } = require("../graphql");
const { GET_POSTS_WITH_USER, GET_PULSE_WITH_USER } = require("../graphql/queries");
const { getPostFromCache, cachePost } = require("../redis/post.redis");
const {
  getPostById,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  deleteComment,
  addComment,
  toggleLikePost,
  getPostByUserId,
} = require("../services/post.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json(ApiResponse.success(user, "User sent"));
  } catch (error) {
    return res
      .status(500)
      .json(ApiError.error("Failed to fetch user", error.message));
  }
};

const getPostApi = async (req, res) => {
  try {
    const postId = req.params.id;

    // let cachedPost;

    // try {
    //   // cachedPost = await getPostFromCache(postId);
    // } catch (cacheError) {
    //   console.error("Cache error: ", cacheError.message);
    // }

    // if (cachedPost) {
    // return res
    //   .status(200)
    //   .json(ApiResponse.success(cachedPost, "Post sent from cache"));
    // } else {
    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json(ApiError.error("Post not found"));
    }

    try {
      await cachePost(postId, post);
    } catch (cacheError) {
      console.error("Error caching post data: ", cacheError.message);
    }

    return res.status(200).json(ApiResponse.success(post, "Post sent"));
    // }
  } catch (error) {
    console.error("General error: ", error.message);
    return res
      .status(500)
      .json(ApiError.error("Failed to fetch post", error.message));
  }
};

const getPostByUseridApi = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await getPostByUserId(userId);
    return res.status(200).json(ApiResponse.success(posts, "Posts sent"));
  }catch(error){
    console.error("General error: ", error.message);
    return res
    .status(500)
    .json(ApiError.error("Failed to fetch posts", error.message));
  }
}

const getPostsApi = async (req, res) => {
  try {
    // console.log("Fetching posts...");
    const result = await apolloServer.executeOperation({
      query: GET_POSTS_WITH_USER,
      context: { userLoader: createUserLoader() },
    });

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors[0].message);
    }

    const posts = result.data?.getPostsWithUser;
    if (!posts) {
      throw new Error("No posts found");
    }
    // console.log("Posts fetched: ", posts);
    return res.status(200).json(ApiResponse.success(posts, "Posts sent"));
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return res
      .status(500)
      .json(ApiError.error("Failed to fetch posts", error.message));
  }
};

const getPulseVideosApi = async (req, res) => {
  try {
    // console.log("Fetching pulse...");
    const result = await apolloServer.executeOperation({
      query: GET_PULSE_WITH_USER,
      context: { userLoader: createUserLoader() },
    });

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors[0].message);
    }

    const pulse = result.data?.getPulseWithUser;
    if (!pulse) {
      throw new Error("No pulse found");
    }
    // console.log("Pulse fetched: ", pulse);
    return res.status(200).json(ApiResponse.success(pulse, "Pulse sent"));
  } catch (error) {
    console.error("Error fetching pulse:", error.message);
    return res
      .status(500)
      .json(ApiError.error("Failed to fetch pulse", error.message));
  }
};

const createPostApi = async (req, res) => {
  try {
    const post = req.body;
    const user = req.user;
    const newPost = await createPost({ ...post, userId: user.id });
    return res.status(201).json(ApiResponse.success(newPost, "Post created"));
  } catch (error) {
    return res
      .status(500)
      .json(ApiError.error("Failed to create post", error.message));
  }
};

const updatePostApi = async (req, res) => {
  try {
    const id = req.params.id;
    const post = req.body;
    const updatedPost = await updatePost(id, post);
    return res
      .status(200)
      .json(ApiResponse.success(updatedPost, "Post updated"));
  } catch (error) {
    return res
      .status(500)
      .json(ApiError.error("Failed to update post", error.message));
  }
};

const deletePostApi = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await deletePost(id);
    return res.status(200).json(ApiResponse.success(post, "Post deleted"));
  } catch (error) {
    return res
      .status(500)
      .json(ApiError.error("Failed to delete post", error.message));
  }
};

const toggleLikePostApi = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user;
    const updatedPost = await toggleLikePost(postId, user);
    return res
      .status(200)
      .json(ApiResponse.success(updatedPost, "Like toggled"));
  } catch (error) {
    return res
      .status(500)
      .json(ApiError.error("Failed to toggle like", error.message));
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
        .json(ApiResponse.success(updatedPost, "Comment deleted"));
    }

    // Add comment
    const comment = req.body.comment;
    // console.log("Comment: ", comment);
    const user = req.user;
    const updatedPost = await addComment(postId, user, comment);
    return res
      .status(201)
      .json(ApiResponse.success(updatedPost, "Comment added"));
  } catch (error) {
    return res
      .status(500)
      .json(ApiError.error("Failed to toggle comment", error.message));
  }
};

module.exports = {
  getUser,
  getPostApi,
  getPostsApi,
  getPulseVideosApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  toggleLikePostApi,
  toggleCommentApi,
  getPostByUseridApi
};
