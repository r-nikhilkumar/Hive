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

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const userExistWithEmail = await getUserByEmail(email);
    if (userExistWithEmail) {
      throw new Error("User already exists with this email!");
    }
    const userExistWithUsername = await getUserByUsername(username);
    if (userExistWithUsername) {
      throw new Error("Username is already taken, choose another one!");
    }
    const user = await createUser({ name, username, email, password });
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    return res
      .status(200)
      .json({
        message: "created user successfully",
        token: token,
        refreshToken: refreshToken,
      });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user;
    if (!email && !username) {
      throw new Error("Provide either username or email");
    } else if (email) {
      user = await getUserByEmail(email);
    } else if (username) {
      user = await getUserByUsername(username);
    }
    if (!user) {
      throw new Error("User not found!");
    }
    await passwordVerify(password, user.password);
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    return res
      .status(200)
      .json({
        message: "user logged in successfully!",
        token: token,
        refreshToken: refreshToken,
      });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }
    const user = await verifyRefreshToken(refreshToken);

    const token = generateToken({_id : user.id});
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;
    user.refreshToken = "";
    await user.save();
    return res.status(200).json({ message: "user logged out successfully!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { register, login, refreshToken, logout };
