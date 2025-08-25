const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes.js");
const connectDatabase = require("./config/database.js");
const userRoutes = require("./Routes/userRoutes.js");
const { errorHandler } = require("./Middlewares/errorMiddleware.js");
const managerRoutes = require("./Routes/managerRoutes.js");
const employeeRoutes = require("./Routes/employeeRoutes.js");

connectDatabase();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175"
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight OPTIONS requests correctly
app.options("*", cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ticket", managerRoutes);
app.use("/employee", employeeRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on " + PORT));
