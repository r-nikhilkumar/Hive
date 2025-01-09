const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const { createProxyMiddleware } = require("http-proxy-middleware")

const app = express()
dotenv.config();
const PORT = process.env.PORT || 3000

app.use(cors())

app.get("/", (req, res)=>{
    return res.send({"message":"welcome"})
})


app.use("/users", createProxyMiddleware({target:`http://localhost:${process.env.USER_PORT}`, changeOrigin:true}))
app.use("/posts", createProxyMiddleware({target:`http://localhost:${process.env.POST_PORT}`, changeOrigin:true}))
app.use("/chats", createProxyMiddleware({target:`http://localhost:${process.env.CHAT_PORT}`, changeOrigin:true}))

app.listen(PORT, ()=>{
    console.log("Listening at "+PORT);
})