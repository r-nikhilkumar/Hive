const mongoose = require("mongoose")

// const USER_MONGODB_URI="mongodb://localhost:27017/Hive-User"
// const USER_MONGO_URI="mongodb+srv://thenikhilkumar11:AkQF6BI68jFTSVJs@hive-user.tkdk9.mongodb.net/"
const USER_MONGO_URI="mongodb+srv://thenikhilkumar11:AkQF6BI68jFTSVJs@hive-user.tkdk9.mongodb.net/?retryWrites=true&w=majority&appName=Hive-User"

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.USER_MONGO_URI || USER_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1); 
    }
  };
  
  module.exports = connectDB;