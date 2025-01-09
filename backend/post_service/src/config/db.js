const mongoose = require("mongoose")

const POST_MONGODB_URL="mongodb://localhost:27017/Hive-Post"

const connectDB = async () => {
    try {
      await mongoose.connect(POST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1); 
    }
  };
  
  module.exports = connectDB;