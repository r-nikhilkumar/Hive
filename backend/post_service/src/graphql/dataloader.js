const DataLoader = require("dataloader");
const axios = require("axios");

const createUserLoader = () =>
  new DataLoader(
    async (userIds) => {
      const userPromises = userIds.map((userId) =>
        axios
          .get(`https://hive-user.onrender.com/get-user/${userId}`)
          .then((response) => {
            console.log(`Fetched user with ID ${userId}:`, response.data.data);
            return response.data.data;
          })
          .catch((error) => {
            console.error(`Failed to fetch user with ID ${userId}:`, error);
            return null;
          })
      );

      const users = await Promise.all(userPromises);
      const userMap = users.reduce((acc, user) => {
        if (user && user._id) {
          acc[user._id] = user;
        }
        return acc;
      }, {});

      const returnUser = userIds.map((userId) => userMap[userId] || null);
      console.log("Returning users:", returnUser);
      return returnUser;
    },
    { cache: true, batch: true }
  );

module.exports = createUserLoader;
