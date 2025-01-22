const { verifyUser } = require("../middlewares/verifyUser")
const userController = require("../controllers/user.controller")

const route = require("express").Router()

route.get("/get-user/:id", userController.getUser)
route.get("/", verifyUser, userController.getAllUsersController); 

module.exports = route;