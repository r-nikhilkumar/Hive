const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../config/jwt");
const {
  createUser,
  getUserByEmail,
  getUserByUsername,
  passwordVerify,
} = require("../services/user.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const userExistWithEmail = await getUserByEmail(email);
    if (userExistWithEmail) {
      return res.status(409).json(ApiError.error("User already exists with this email!"));
    }
    const userExistWithUsername = await getUserByUsername(username);
    if (userExistWithUsername) {
      return res.status(409).json(ApiError.error("Username is already taken, choose another one!"));
    }
    const user = await createUser({ name, username, email, password });
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    return res.status(201).json(ApiResponse.success({ token, refreshToken }, "User created successfully"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to register user", error.message));
  }
};

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user;
    if (!email && !username) {
      return res.status(400).json(ApiError.error("Provide either username or email"));
    } else if (email) {
      user = await getUserByEmail(email);
    } else if (username) {
      user = await getUserByUsername(username);
    }
    if (!user) {
      return res.status(404).json(ApiError.error("User not found!"));
    }
    await passwordVerify(password, user.password);
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json(ApiResponse.success({ token, refreshToken }, "User logged in successfully"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to login user", error.message));
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json(ApiError.error("Refresh token is required"));
    }
    const user = await verifyRefreshToken(refreshToken);
    const token = generateToken({ _id: user.id });
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json(ApiResponse.success({ token }, "Token refreshed successfully"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to refresh token", error.message));
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;
    user.refreshToken = "";
    await user.save();
    res.clearCookie("token"); // Clear the authentication token cookie
    res.clearCookie("refreshToken"); // Clear the refresh token cookie
    return res.status(200).json(ApiResponse.success(null, "User logged out successfully"));
  } catch (error) {
    return res.status(500).json(ApiError.error("Failed to logout user", error.message));
  }
};

module.exports = { register, login, refreshToken, logout };
