// const { Redis } = require('ioredis');
// require('dotenv').config();

// let client;

// try {
//   client = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     password: process.env.REDIS_PASSWORD,
//     tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
//   });

//   client.on('error', (err) => {
//     console.error('Redis connection error:', err);
//   });

//   client.on('connect', () => {
//     console.log('Connected to Redis');
//   });

//   client.on('ready', () => {
//     console.log('Redis client is ready');
//   });
// } catch (err) {
//   console.error('Error initializing Redis client:', err);
//   client = null;
//   console.log('Redis not available, continuing without Redis...');
// }

// module.exports = client;
