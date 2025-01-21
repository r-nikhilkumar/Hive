const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const getUserById = async (id) => {
  return await User.findById(id).select("-password -__v -refreshToken");
};

const getUserByUsername = async (username) => {
  return await User.findOne({ username });
};
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userDetails) => {
  try {
    const password = await bcrypt.hash(userDetails.password, 8);
    const newUser = await User.create({ ...userDetails, password: password });
    return newUser;
  } catch (error) {
    throw error;
  }
};

const passwordVerify = async (currentpassword, realPassword) => {
  try {
    const isPasswordValid = await bcrypt.compare(currentpassword, realPassword);
    if (!isPasswordValid) {
      throw new Error("Wrong Password!");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  passwordVerify,
};
