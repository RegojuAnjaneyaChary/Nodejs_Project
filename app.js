const express = require("express");
const app = express();
require("dotenv").config();
const authRoutes = require("./Routes/authRoutes.js")
const connectDatabase = require("./config/database.js")
const userRoutes = require("./Routes/userRoutes.js");
const { errorHandler } = require("./Middlewares/errorMiddleware.js");
const managerRoutes = require("./Routes/managerRoutes.js");
const employeeRoutes = require("./Routes/employeeRoutes.js");
const cors = require("cors")

connectDatabase();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5175"], // allowed origins
  credentials: true // this allows cookies, sessions, and Authorization headers
}));


app.use(express.json());
app.use(express.urlencoded(true));


app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ticket", managerRoutes);
app.use("/employee", employeeRoutes);

app.use(errorHandler);

app.listen(process.env.port, () =>
  console.log("server started on " + process.env.port)
);