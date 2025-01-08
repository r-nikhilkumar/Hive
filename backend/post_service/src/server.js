const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const postRouter = require("./routes/post.route");
const connetDB = require("../src/config/db");

const app = express();
dotenv.config();
const PORT = process.env.POST_PORT || 3002;

app.use(express.json());
app.use(cors());
connetDB();

app.use("/", postRouter);

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
