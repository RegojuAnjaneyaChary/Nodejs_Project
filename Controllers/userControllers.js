const { UserModel } = require("../Models/authModel.js")
const bcryptjs = require("bcryptjs");
const { cloudinaryFileUpload } = require("../Utils/cloudinary.js");
const fs = require("fs");

// Role-based profile retrieval
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.userInfo.id;      // from JWT middleware
    const userRole = req.userInfo.role;  // role from JWT middleware

    let user;

    if (userRole === "manager") {
      // Manager sees only their own profile
      user = await UserModel.findById(userId).select("-password");
    } else {
      // Employee sees only their own profile
      user = await UserModel.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    res.json(user);
    console.log("Profile data:", user);
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    next({ statusCode: 400, message: error.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    console.log("=== EditProfile request received ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("User ID:", req.userInfo.id);
    console.log("User info:", req.userInfo);

    const { name, username, password, email } = req.body;
    const userId = req.userInfo.id;

    // Build update object with only provided fields
    let updateFields = {};

    if (name) {
      updateFields.name = name;
      console.log("Adding name to update:", name);
    }
    if (username) {
      updateFields.username = username;
      console.log("Adding username to update:", username);
    }
    if (email) {
      updateFields.email = email;
      console.log("Adding email to update:", email);
    }

    // Handle password only if provided
    if (password && password.trim() !== "") {
      console.log("Processing password update");
      const hashPassword = await bcryptjs.hash(password, 12);
      updateFields.password = hashPassword;
    }

    // Handle profile image only if provided
    if (req.file) {
      console.log("=== Processing file upload ===");
      console.log("File details:", req.file);

      try {
        // Check if file exists
        if (!fs.existsSync(req.file.path)) {
          throw new Error("Uploaded file not found on server");
        }

        console.log("File exists at path:", req.file.path);
        console.log("File size:", req.file.size);

        const fileurl = await cloudinaryFileUpload(req.file.path);
        console.log("Cloudinary upload successful:", fileurl);

        // Delete local file after successful upload
        fs.unlinkSync(req.file.path);
        console.log("Local file deleted");

        updateFields.profilePic = fileurl;
        console.log("Profile pic URL added to update fields:", fileurl);

      } catch (uploadError) {
        console.error("=== Image upload error ===");
        console.error("Error details:", uploadError);
        console.error("Error message:", uploadError.message);
        console.error("Error stack:", uploadError.stack);

        // Clean up local file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
            console.log("Cleaned up local file after error");
          } catch (cleanupError) {
            console.error("Error cleaning up file:", cleanupError);
          }
        }

        return res.status(500).json({
          message: `Failed to upload image: ${uploadError.message}`,
          details: uploadError.stack
        });
      }
    } else {
      console.log("No file uploaded");
    }

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
      console.log("No fields to update");
      return res.status(400).json({ message: "No fields to update" });
    }

    console.log("=== Updating user with fields ===");
    console.log("Update fields:", updateFields);

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    ).select("-password");

    if (!updateUser) {
      console.log("User not found for update");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("=== User updated successfully ===");
    console.log("Updated user:", updateUser);

    res.json({ message: "Profile updated successfully", updateUser });

  } catch (error) {
    console.error("=== Error in editProfile ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Clean up any uploaded file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Cleaned up local file after error");
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack
    });
  }
}
