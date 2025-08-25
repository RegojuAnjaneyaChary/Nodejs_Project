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

// Allowed origins for development (and you can add production later)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // Allow the origin
    } else {
      callback(new Error("Not allowed by CORS")); // Block others
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Explicitly handle preflight OPTIONS requests
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ticket", managerRoutes);
app.use("/employee", employeeRoutes);

// Error handler
app.use(errorHandler);

app.listen(process.env.port, () =>
  console.log("server started on " + process.env.port)
);
