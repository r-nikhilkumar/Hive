// // /cache/userCache.js
// const redisClient = require("../../../config/redis");

// const getUserFromCache = async (userId) => {
//   return new Promise((resolve, reject) => {
//     redisClient.get(`user:${userId}`, (err, cacheduser) => {
//       if (err) return reject(err);
//       resolve(cacheduser ? JSON.parse(cacheduser) : null);
//     });
//   });
// };

// const cacheUser = async (userId, user) => {
//   return new Promise((resolve, reject) => {
//     redisClient.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600, (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

// module.exports = { getUserFromCache, cacheUser };
