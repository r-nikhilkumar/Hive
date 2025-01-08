const authController = require("../controllers/auth.controller.js")
const { verifyUser } = require("../middlewares/verifyUser.js")

const route = require("express").Router()

route.post("/sign-up", authController.register)
route.post("/sign-in", authController.login)
route.post("/refresh-token", authController.refreshToken)
route.post("/logout", verifyUser, authController.logout)

module.exports = route;
