const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET_KEY="hiveisheretoconnect"
const JWT_REFRESH_SECRET="hiveisheretoconnectAgainAndAgain"

const verifyUser = async (req, res, next) => {
  let token = req.cookies.token;
  if(!token) {
    token = req.header("Authorization")?.replace("Bearer ", "");
  }
  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token" });
  }
};

module.exports = { verifyUser };