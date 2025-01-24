// // /cache/postCache.js
// const redisClient = require("../../../config/redis");

// const getPostFromCache = async (postId) => {
//   return new Promise((resolve, reject) => {
//     redisClient.get(`post:${postId}`, (err, cachedPost) => {
//       if (err) return reject(err);
//       resolve(cachedPost ? JSON.parse(cachedPost) : null);
//     });
//   });
// };

// const cachePost = async (postId, post) => {
//   return new Promise((resolve, reject) => {
//     redisClient.set(`post:${postId}`, JSON.stringify(post), 'EX', 3600, (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

// module.exports = { getPostFromCache, cachePost };
