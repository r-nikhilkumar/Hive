const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const postRouter = require("./routes/post.route");
const connetDB = require("../src/config/db");
const cookieParser = require("cookie-parser");
const body = require("body-parser");
const { apolloServer } = require("./graphql");

const app = express();
dotenv.config();
const PORT = process.env.POST_PORT || 3002;

app.use(express.json());
app.use(cookieParser());
app.use(body.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:5173","https://hive-gold.vercel.app", "https://hive-gateway.onrender.com"],
  credentials: true
}))
connetDB();

async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
}

startApolloServer();

app.use("/", postRouter);

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
