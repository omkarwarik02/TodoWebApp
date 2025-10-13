const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/Db"); // your MongoDB connect function
const authRoutes = require("../routes/authRoutes");
const todoRoutes = require("../routes/todoRoutes");



const app = express();

// Connect to MongoDB first
connectDB()
  .then(() => {
    console.log("MongoDB Connected");

    // Middleware
    app.use(cors({
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/todos", todoRoutes);

    // Start server only after DB is connected
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // stop server if DB fails
  });
