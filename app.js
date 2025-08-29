const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

// Import routes and middleware
const connectDatabase = require("./config/database.js");
const authRoutes = require("./Routes/authRoutes.js");
const userRoutes = require("./Routes/userRoutes.js");
const managerRoutes = require("./Routes/managerRoutes.js");
const employeeRoutes = require("./Routes/employeeRoutes.js");
const { errorHandler } = require("./Middlewares/errorMiddleware.js");

// Connect to database
connectDatabase();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://task-manager-green-nine.vercel.app"
  ],
  credentials: true
}));


// ✅ Automatically handle preflight requests
// (You don't need `app.options("*")` separately)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ticket", managerRoutes);
app.use("/employee", employeeRoutes);

// ✅ Error handling middleware
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
