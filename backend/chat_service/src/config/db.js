const mongoose = require("mongoose")

// const CHAT_MONGODB_URL="mongodb://localhost:27017/Hive-Chat"
// const CHAT_MONGO_URI="mongodb+srv://thenikhilkumar11:FftYoUGz0gbIYPaa@hive-chat.k6s1c.mongodb.net/"
const CHAT_MONGO_URI="mongodb+srv://thenikhilkumar11:FftYoUGz0gbIYPaa@hive-chat.k6s1c.mongodb.net/?retryWrites=true&w=majority&appName=Hive-Chat"

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.CHAT_MONGO_URI || CHAT_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1); 
    }
  };
  
  module.exports = connectDB;