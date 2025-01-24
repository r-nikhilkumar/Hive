const mongoose = require("mongoose")

// const USER_MONGODB_URL="mongodb://localhost:27017/Hive-User"
const USER_MONGODB_URL="mongodb+srv://thenikhilkumar11:AkQF6BI68jFTSVJs@hive-user.tkdk9.mongodb.net/"

const connectDB = async () => {
    try {
      await mongoose.connect(USER_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1); 
    }
  };
  
  module.exports = connectDB;