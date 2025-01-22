const { verifyUser } = require("../middlewares/verifyUser");
const postController = require("../controllers/post.controller");

const route = require("express").Router();

route.get("/get-post/:id", verifyUser, postController.getPostApi);
route.get("/get-posts", postController.getPostsApi); // New route to get all posts
route.post("/create-post", verifyUser, postController.createPostApi);
route.put("/update-post/:id", verifyUser, postController.updatePostApi);
route.delete("/delete-post/:id", verifyUser, postController.deletePostApi);
route.post("/toggle-like/:id", verifyUser, postController.toggleLikePostApi);
route.post(
  "/toggle-comment/:postId/:commentId?",
  verifyUser,
  postController.toggleCommentApi
);

module.exports = route;
