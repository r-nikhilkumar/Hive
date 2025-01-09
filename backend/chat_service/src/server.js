const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const chatRouter = require("./routes/chat.route");
const connetDB = require("../src/config/db");

const app = express();
dotenv.config();
const PORT = process.env.CHAT_PORT || 3003;

app.use(express.json());
app.use(cors());
connetDB();

app.use("/", chatRouter);

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
