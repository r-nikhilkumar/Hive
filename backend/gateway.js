const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { uploadFilesApi } = require("./srcCommon/controllerCommon/uploadFilesApi");
const multer = require("multer");
const upload = multer({ dest: "./temp/upload/" });

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Redis setup
const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

pubClient.connect();
subClient.connect();

io.adapter(createAdapter(pubClient, subClient));

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.send({ message: "Welcome to the gateway!" });
});

app.post("/upload", upload.array("files"), uploadFilesApi);


// Proxy HTTP requests to microservices
app.use(
  "/users",
  createProxyMiddleware({
    target: `http://localhost:${process.env.USER_PORT}`,
    changeOrigin: true,
  })
);
app.use(
  "/posts",
  createProxyMiddleware({
    target: `http://localhost:${process.env.POST_PORT}`,
    changeOrigin: true,
  })
);
app.use(
  "/chats",
  createProxyMiddleware({
    target: `http://localhost:${process.env.CHAT_PORT}`,
    changeOrigin: true,
    ws: true,
  })
);

io.on("connection", (socket) => {
  console.log("A user connected to the gateway: " + socket.id);

  // Forward socket events to Redis (Pub/Sub)
  socket.on("joinRoom", (data) => {
    console.log("User joined room via gateway:", data);
    io.emit("joinRoom", data); // Broadcast to Redis-connected services
  });

  socket.on("message", (data) => {
    console.log("User sent message via gateway:", data);
    io.emit("message", data);
  });

  socket.on("leaveRoom", (data) => {
    console.log("User left room via gateway:", data);
    io.emit("leaveRoom", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected from the gateway: " + socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});
