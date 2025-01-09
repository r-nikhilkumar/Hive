const mongoose = require("mongoose")

const CHAT_MONGODB_URL="mongodb://localhost:27017/Hive-Chat"

const connectDB = async () => {
    try {
      await mongoose.connect(CHAT_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1); 
    }
  };
  
  module.exports = connectDB;