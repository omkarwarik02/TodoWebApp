require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ✅ Must return or await this promise
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    return mongoose.connection; // ✅ RETURN connection so .then() chain works
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
