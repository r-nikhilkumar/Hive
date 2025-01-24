const DataLoader = require("dataloader");
const axios = require("axios");

const createUserLoader = () =>
  new DataLoader(
    async (userIds) => {
      try {
        const response = await axios.post(`https://hive-user.onrender.com/get-users`, {
          ids: userIds,
        });
        const users = response.data.data;
        // console.log(`Fetched users:`, users);

        const userMap = users.reduce((acc, user) => {
          if (user && user._id) {
            acc[user._id] = user;
          }
          return acc;
        }, {});

        const returnUser = userIds.map((userId) => userMap[userId] || null);
        console.log("Returning users:", returnUser);
        return returnUser;
      } catch (error) {
        console.error(`Failed to fetch users:`, error.response ? error.response.data : error.message);
        return userIds.map(() => null);
      }
    },
    { cache: true, batch: true }
  );

module.exports = createUserLoader;
