const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const {
  uploadFilesApi,
} = require("./srcCommon/controllerCommon/uploadFilesApi");
const multer = require("multer");
const upload = multer({ dest: "./temp/upload/" });
const cookieParser = require("cookie-parser");
const client = require("./config/redis");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://hive-gold.vercel.app",
      "http://localhost:3002",
      "https://hive-post.onrender.com",
      "http://localhost:3003",
      "http://localhost:3001",
    ],
    credentials: true,
  },
});

// Redis setup
const pubClient = client;
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

app.use(cookieParser());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://hive-gold.vercel.app"],
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
    target: `https://hive-user.onrender.com`,
    changeOrigin: true,
  })
);
app.use(
  "/posts",
  createProxyMiddleware({
    target: `https://hive-post.onrender.com`,
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

  socket.on("joinRoom", (data) => {
    console.log("User joined room via gateway:", data);
    io.emit("joinRoom", data);
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
