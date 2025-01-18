const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const authRoutes = require("./routes/auth.route")
const userRoutes = require("./routes/user.route")
const connectDB = require("./config/db")
const cookieParser = require("cookie-parser");

const app = express()
dotenv.config();
const PORT = process.env.USER_PORT || 3001

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3002", "http://localhost:3003"],
    credentials: true
}))
app.use(cookieParser()); // Use cookie-parser middleware

connectDB()

app.use("/auth", authRoutes)
app.use("/", userRoutes)

app.listen(PORT, ()=>{
    console.log("Listening at "+PORT);
})