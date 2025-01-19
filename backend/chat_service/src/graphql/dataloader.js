const DataLoader = require("dataloader");
const axios = require("axios");

const createUserLoader = () =>
  new DataLoader(async (userIds) => {
    const uniqueUserIds = [...new Set(userIds.map((id) => id.toString()))];
    // console.log(uniqueUserIds);
    const userPromises = uniqueUserIds.map((userId) =>
      axios.get(`http://localhost:3000/users/get-user/${userId}`)
        .then(response => response.data.data)
        .catch(error => {
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

    return userIds.map((userId) => userMap[userId] || null);
  }, { cache: true, batch: true });

module.exports = createUserLoader;
