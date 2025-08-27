const express = require("express");
const Router = express.Router();
const { getProfile, editProfile } = require("../Controllers/userControllers.js")
const { tokenValidator, validateMiddleware, editProfileValidator } = require("../Validators/authValidators.js")
const { checkAuth } = require("../Middlewares/authMiddleware.js");
const { upload } = require("../Utils/multerFile.js")
const multer = require('multer');

Router.get("/profile", tokenValidator, validateMiddleware, checkAuth, getProfile);

// Add error handling for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

Router.put("/editProfile",
    tokenValidator,
    editProfileValidator,
    validateMiddleware,
    checkAuth,
    upload.single("profilePic"),
    handleMulterError,
    editProfile
);

module.exports = Router;