const { getUserById } = require("../services/user.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const redisClient = require("../../../config/redis");
const { getUserFromCache, cacheUser } = require("../redis/user.redis");

const getUser = async (req, res) => {
  console.log("Fetching user data");
  try {
    const userId = req.params.id;
    console.log("back id: ", userId)

    let cachedUser;

    try {
      cachedUser = await getUserFromCache(userId);
    } catch (cacheError) {
      console.error("Cache error: ", cacheError.message);
    }

    if (cachedUser) {
      console.log("User: ",cachedUser)
      return res
        .status(200)
        .json(ApiResponse.success(cachedUser, "User sent from cache"));
    } else {
      const user = await getUserById(userId);

      if (!user) {
        return res.status(404).json(ApiError.error("User not found"));
      }

      try {
        await cacheUser(userId, user);
      } catch (cacheError) {
        console.error("Error caching user data: ", cacheError.message);
      }
      console.log("User: ",user)

      return res.status(200).json(ApiResponse.success(user, "User sent"));
    }
  } catch (error) {
    console.error("General error: ", error.message);
    return res
      .status(500)
      .json(ApiError.error("Failed to fetch user", error.message));
  }
};

module.exports = { getUser };
