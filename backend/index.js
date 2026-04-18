require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const seedData = require("./src/seeds/seed");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const contentRoutes = require("./src/routes/contentRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const userRoutes = require("./src/routes/userRoutes");

// Import Middleware
const errorHandler = require("./src/middlewares/errorMiddleware");

// Connect to Database
connectDB();

// Run seed data
seedData();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Root route
app.get("/api", (req, res) => {
  res.send("CMS API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
