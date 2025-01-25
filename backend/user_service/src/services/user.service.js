const User = require("../models/user.model");
const bcrypt = require("bcrypt");
// const { getUserFromCache, cacheUser } = require("../redis/user.redis");

const getUserById = async (id) => {
  // let user = await getUserFromCache(id);
  // if (!user) {
  const user = await User.findById(id).select("-password -__v -refreshToken");
  // if (user) {
  // await cacheUser(id, user);
  // }
  // }
  return user;
};

const getUserByUsername = async (username) => {
  return await User.findOne({ username });
};
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getAllUsers = async (userId) => {
  // console.log("inside getAll users userId: ", userId);
  return await User.find({ _id: { $ne: userId } }).select(
    "-password -__v -refreshToken"
  );
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

const getUsersByIds = async (ids) => {
  return await User.find({ _id: { $in: ids } }).select("-password -__v -refreshToken");
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  passwordVerify,
  getAllUsers,
  getUsersByIds, // Export the new method
};
