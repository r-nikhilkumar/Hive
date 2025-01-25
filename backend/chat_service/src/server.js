const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const chatRoute = require("./routes/chat.route");
const connectDB = require("./config/db");
const { getUserFromToken } = require("./config/jwt");
const { deleteMessage } = require("./services/chat.service");
const { apolloServer } = require("./graphql");
const { GET_MESSAGES_WITH_USER, CREATE_MESSAGE } = require("./graphql/queries");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://studio.apollographql.com",
      "https://hive-gold.vercel.app",
    ],
    credentials: true,
  },
});

const PORT = process.env.CHAT_PORT || 3003;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://studio.apollographql.com",
      "https://hive-gold.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
connectDB();
app.use("/", chatRoute);

async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
}

startApolloServer();

const activeUsers = {};

io.use((socket, next) => {
  let token = socket.handshake.headers.cookie
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  // console.log("socket things: ", socket.handshake);
  if (!token) token = socket.handshake.auth?.authorization?.split(" ")[1];
  // console.log("token", token);
  if (!token) return next(new Error("Authentication error"));
  try {
    socket.user = getUserFromToken(token);
    socket.token = token;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ chatRoomId }) => {
    socket.join(chatRoomId);
    if (!activeUsers[chatRoomId]) activeUsers[chatRoomId] = [];
    activeUsers[chatRoomId].push(socket.id);
    io.to(chatRoomId).emit("activeUsers", activeUsers[chatRoomId]);

    try {
      const messagesWithUser = await apolloServer.executeOperation({
        query: GET_MESSAGES_WITH_USER,
        variables: { chatRoomId },
      });
      // console.log("previousMessages", messagesWithUser.data.getMessagesWithUser)
      socket.emit(
        "previousMessages",
        messagesWithUser.data?.getMessagesWithUser
      );
    } catch (error) {
      console.error("Error fetching messages with user info:", error);
    }
  });

  socket.on("message", async ({ chatRoomId, message, attachments }) => {
    try {
      const result = await apolloServer.executeOperation({
        query: CREATE_MESSAGE,
        variables: {
          chatRoomId,
          userId: socket.user.id,
          message,
          attachments,
        },
      });
      io.to(chatRoomId).emit("message", result.data?.createMessage);
    } catch (error) {
      console.error("Error creating message with user info:", error);
    }
  });

  socket.on("deleteMessage", async ({ chatRoomId, messageId }) => {
    try {
      await deleteMessage(messageId);
      io.to(chatRoomId).emit("messageDeleted", { messageId });
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const chatRoomId in activeUsers) {
      activeUsers[chatRoomId] = activeUsers[chatRoomId].filter(
        (id) => id !== socket.id
      );
      io.to(chatRoomId).emit("activeUsers", activeUsers[chatRoomId]);
    }
  });
});

server.listen(PORT, () =>
  console.log(`Chat service listening on port ${PORT}`)
);
