const DataLoader = require("dataloader");
const axios = require("axios");

const createUserLoader = () =>
  new DataLoader(
    async (userIds) => {
      const response = await axios.post(
        `https://hive-user.onrender.com/get-users`,
        {
          ids: userIds,
        }
      );
      const users = response.data.data;
      const userMap = users.reduce((acc, user) => {
        if (user && user._id) {
          acc[user._id] = user;
        }
        return acc;
      }, {});

      const returnUser = userIds.map((userId) => userMap[userId] || null);
      //   console.log(returnUser)
      return returnUser;
    },
    { cache: true, batch: true }
  );

module.exports = createUserLoader;
