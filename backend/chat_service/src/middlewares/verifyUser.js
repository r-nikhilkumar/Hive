const { getUserFromToken } = require("../config/jwt");

const verifyUser = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token, authorization denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { verifyUser };
