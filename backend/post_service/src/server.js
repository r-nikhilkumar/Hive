const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const postRouter = require("./routes/post.route");
const connetDB = require("../src/config/db");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();
const PORT = process.env.POST_PORT || 3002;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
connetDB();

app.use("/", postRouter);

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
