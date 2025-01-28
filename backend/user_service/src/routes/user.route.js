const { verifyUser } = require("../middlewares/verifyUser");
const userController = require("../controllers/user.controller");

const route = require("express").Router();

route.get("/get-user/:id", userController.getUser);
route.get("/", verifyUser, userController.getAllUsersController);
route.post("/get-users", userController.getUsers); // New route for fetching multiple users
route.get("/get-user-un/:username", userController.getProfileByUsernameApi)

module.exports = route;