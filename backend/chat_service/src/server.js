const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const chatRoute = require("./routes/chat.route");
const connectDB = require("./config/db");
const { verifyUser } = require("./middlewares/verifyUser");
const { getUserFromToken } = require("./config/jwt");
const { createMessage, getMessagesByChatRoom } = require("./services/chat.service");

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

const PORT = process.env.CHAT_PORT || 3003;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
connectDB()

app.use("/", chatRoute);

const activeUsers = {};

io.use((socket, next) => {
  const token = socket.handshake.headers.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    console.log("No token found, disconnecting socket");
    return next(new Error("Authentication error"));
  }

    try{
      socket.user = getUserFromToken(token);
      next();
    }catch(err){
      console.log("Token verification failed, disconnecting socket", err);
      next(new Error("Authentication error"));
    };
});

io.on("connection", (socket) => {
  // console.log(`User connected to chat service: ${socket.id}, User ID: ${socket.user.id}`);

  socket.on("joinRoom", async ({ chatRoomId }) => {
    // console.log(`User joined room ${chatRoomId} on chat service`);
    socket.join(chatRoomId);

    if (!activeUsers[chatRoomId]) {
      activeUsers[chatRoomId] = [];
    }
    activeUsers[chatRoomId].push(socket.id);

    // Emit active users to the room
    io.to(chatRoomId).emit("activeUsers", activeUsers[chatRoomId]);

    // Send previous messages to the user
    const messages = await getMessagesByChatRoom(chatRoomId);
    socket.emit("previousMessages", messages);
  });

  socket.on("message", async ({ chatRoomId, message, attachments }) => {
    // console.log(`Received message for room ${chatRoomId}:`, message);
    // console.log("sendid id", socket.id);
    // console.log("userid id", socket.user.id);

    // Save message to database
    const savedMessage = await createMessage(socket.user.id, chatRoomId, message, attachments);

    // Emit the message to all clients in the room
    io.to(chatRoomId).emit("message", savedMessage);
  });

  socket.on("leaveRoom", ({ chatRoomId }) => {
    // console.log(`User left room ${chatRoomId} on chat service`);
    socket.leave(chatRoomId);

    if (activeUsers[chatRoomId]) {
      activeUsers[chatRoomId] = activeUsers[chatRoomId].filter((id) => id !== socket.id);
      io.to(chatRoomId).emit("activeUsers", activeUsers[chatRoomId]);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected from chat service: ${socket.id}`);
    for (const chatRoomId in activeUsers) {
      activeUsers[chatRoomId] = activeUsers[chatRoomId].filter((id) => id !== socket.id);
      io.to(chatRoomId).emit("activeUsers", activeUsers[chatRoomId]);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chat service listening on port ${PORT}`);
});
