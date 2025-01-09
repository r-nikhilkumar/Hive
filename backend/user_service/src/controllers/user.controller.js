const { getUserById } = require("../services/user.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return res.status(200).json(ApiResponse.success(user, "User sent"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to fetch user", error.message));
  }
};

module.exports = { getUser };
