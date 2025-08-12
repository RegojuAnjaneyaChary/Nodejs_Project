const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["manager", "employee"],
      required: true,
      default: "employee",
    },
    password: { type: String, required: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", authSchema);

module.exports = { UserModel };