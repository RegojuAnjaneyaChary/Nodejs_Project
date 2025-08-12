const mongoose = require("mongoose");
require("dotenv").config();

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.mongodb_uri, {
      dbName: process.env.mongodb_name,
    });
    console.log(
      "Database connected successfully to " + process.env.mongodb_name
    );
  } catch (error) {
    console.log("Database connection failed");
    console.log(error);
  }
}

module.exports = connectDatabase;