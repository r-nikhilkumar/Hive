const mongoose = require("mongoose")

// const POST_MONGODB_URL="mongodb://localhost:27017/Hive-Post"
// const POST_MONGO_URI="mongodb+srv://thenikhilkumar11:MGNYc2shd31MTgG4@hive-post.xea0s.mongodb.net/"
const POST_MONGO_URI="mongodb+srv://thenikhilkumar11:MGNYc2shd31MTgG4@hive-post.xea0s.mongodb.net/?retryWrites=true&w=majority&appName=Hive-Post"

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.POST_MONGO_URI || POST_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1); 
    }
  };
  
  module.exports = connectDB;