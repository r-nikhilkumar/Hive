const { Redis } = require('ioredis');

let client;

try {
  client = new Redis();
  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  client.on('connect', () => {
    console.log('Connected to Redis');
  });

  client.on('ready', () => {
    console.log('Redis client is ready');
  });
} catch (err) {
  console.error('Error initializing Redis client:', err);
  client = null;
  console.log('Redis not available, continuing without Redis...');
}

module.exports = client;
