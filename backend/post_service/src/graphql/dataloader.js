const DataLoader = require("dataloader");
const axios = require("axios");

const createUserLoader = () =>
  new DataLoader(
    async (userIds) => {
      const userPromises = userIds.map((userId) =>
        axios
          .get(`http://localhost:3000/users/get-user/${userId}`)
          .then((response) => response.data.data)
          .catch((error) => {
            // console.error(`Failed to fetch user with ID ${userId}:`, error);
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
      //   console.log(returnUser)
      return returnUser;
    },
    { cache: true, batch: true }
  );

module.exports = createUserLoader;
