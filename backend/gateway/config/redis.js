const { createClient } = require("redis");

let client;

try {
  console.log(process.env.REDIS_USERNAME)
  client = createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  client.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  client.on("connect", () => {
    console.log("Connected to Redis");
  });

  client.on("ready", () => {
    console.log("Redis client is ready");
  });

  client.on("end", () => {
    console.log("Redis connection closed");
  });

  client.connect().catch((err) => {
    console.error("Error connecting to Redis:", err);
  });
} catch (err) {
  console.error("Error initializing Redis client:", err);
  client = null;
  console.log("Redis not available, continuing without Redis...");
}

module.exports = client;
