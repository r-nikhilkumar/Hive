const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const chatRouter = require("./routes/chat.route");
const connetDB = require("../src/config/db");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();
const PORT = process.env.CHAT_PORT || 3003;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser()); // Use cookie-parser middleware
connetDB();

app.use("/", chatRouter);

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
