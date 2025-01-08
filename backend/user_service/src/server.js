const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const authRoutes = require("./routes/auth.route")
const userRoutes = require("./routes/user.route")
const connectDB = require("./config/db")

const app = express()
dotenv.config();
const PORT = process.env.USER_PORT || 3001

app.use(express.json())
app.use(cors())

connectDB()

app.use("/auth", authRoutes)
app.use("/", userRoutes)

// app.post("/", (req, res)=>{
//     return res.send({"message":"welcome to user service"})
// })

app.listen(PORT, ()=>{
    console.log("Listening at "+PORT);
})