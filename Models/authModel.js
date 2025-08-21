const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    name: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    role: { type: String, require: true, enum: ["manager", "employee"], default: "employee" },
    password: { type: String, require: true },
    profilePic: { type: String},

}, { timestamps: true }
);

const UserModel = mongoose.model("users", authSchema);
module.exports = { UserModel };