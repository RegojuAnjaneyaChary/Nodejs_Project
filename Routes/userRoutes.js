const express = require("express");
const Router = express.Router();
const { getProfile, editProfile } = require("../Controllers/userController.js");
const {
  tokenValidator,
  editProfileValidator,
  validateMiddleware,
} = require("../Validators/authValidators.js");
const { checkAuth } = require("../Middlewares/authMiddleware.js");
const { upload } = require("../Utils/multerFileUpload.js");
Router.get(
  "/profile",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  getProfile
);
Router.put(
  "/editProfile",
  tokenValidator,
  editProfileValidator,
  validateMiddleware,
  checkAuth,
  upload.single("profilePic"),
  editProfile
);

module.exports = Router;