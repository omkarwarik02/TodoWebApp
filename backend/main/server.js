const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require("express");
const mongoose = require("mongoose");
const agenda = require("../agenda/agendaInstance");
// ✅ use Agenda directly here
const connectDB = require("../config/Db");
const authRoutes = require("../routes/authRoutes");
const todoRoutes = require("../routes/todoRoutes");
const defineJobs = require("../jobs/agendaJobs");
const cors = require("cors");
const notificationRoutes = require("../routes/notificationRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://todo-web-aj1ghxlw1-omkarwarik02s-projects.vercel.app",
    "http://localhost:4200"
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

// Handle CORS Preflight Manually
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }
  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/notifications", notificationRoutes);


// ✅ DB + Agenda
// ✅ DB + Agenda + Server
// ✅ DB + Agenda + Server
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Ready");

    defineJobs(agenda);     // load job definitions
    await agenda.start();   // start scheduler
    console.log("✅ Agenda Started");

    app.listen(5000, () =>
      console.log("🚀 Server running on port 5000")
    );

  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    process.exit(1);
  }
})();


