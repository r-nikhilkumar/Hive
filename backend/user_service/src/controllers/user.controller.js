const { getUserById, getAllUsers, getUsersByIds } = require("../services/user.service"); // Import getUsersByIds service
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
// const redisClient = require("../../../config/redis");
// const { getUserFromCache, cacheUser } = require("../redis/user.redis");

const getUser = async (req, res) => {
  // console.log("Fetching user data");
  try {
    const userId = req.params.id;
    // console.log("back id: ", userId)

    // let cachedUser;

    // try {
    //   cachedUser = await getUserFromCache(userId);
    // } catch (cacheError) {
    //   console.error("Cache error: ", cacheError.message);
    // }

    // if (cachedUser) {
    //   // console.log("User: ",cachedUser)
    //   return res
    //     .status(200)
    //     .json(ApiResponse.success(cachedUser, "User sent from cache"));
    // } else {
      const user = await getUserById(userId);

      if (!user) {
        return res.status(404).json(ApiError.error("User not found"));
      }

      // try {
      //   await cacheUser(userId, user);
      // } catch (cacheError) {
      //   console.error("Error caching user data: ", cacheError.message);
      // }
      // console.log("User: ",user)

      return res.status(200).json(ApiResponse.success(user, "User sent"));
    // }
  } catch (error) {
    console.error("General error: ", error.message);
    return res
      .status(500)
      .json(ApiError.error("Failed to fetch user", error.message));
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await getAllUsers(userId);
    return res.status(200).json(ApiResponse.success(users, "Users fetched successfully"));
  } catch (error) {
    console.error("Error fetching users: ", error.message);
    return res.status(500).json(ApiError.error("Failed to fetch users", error.message));
  }
};

const getUsers = async (req, res) => {
  try {
    const userIds = req.body.ids; // Expecting an array of user IDs in the request body
    const users = await getUsersByIds(userIds);

    if (!users || users.length === 0) {
      return res.status(404).json(ApiError.error("Users not found"));
    }

    return res.status(200).json(ApiResponse.success(users, "Users sent"));
  } catch (error) {
    console.error("General error: ", error.message);
    return res
      .status(500)
      .json(ApiError.error("Failed to fetch users", error.message));
  }
};

module.exports = { getUser, getAllUsersController, getUsers };
