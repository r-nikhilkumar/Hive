const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "72h" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

const getUserFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decodedToken;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired. Please login again.");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token. Authentication failed.");
    }
    throw new Error("Error verifying token: " + error.message);
  }
};

module.exports = { generateToken, generateRefreshToken, verifyRefreshToken, getUserFromToken };