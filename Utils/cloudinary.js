const cloudinary = require("cloudinary").v2;
require("dotenv").config();

console.log("=== Cloudinary Configuration ===");
console.log("Cloud name:", process.env.cloudinary_cloud_name ? "Set" : "Missing");
console.log("API key:", process.env.cloudinary_api_key ? "Set" : "Missing");
console.log("API secret:", process.env.cloudinary_api_secret ? "Set" : "Missing");

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});

//Upload an image
async function cloudinaryFileUpload(file) {
    try {
        console.log("=== Starting Cloudinary upload ===");
        console.log("File path:", file);

        if (!file) {
            throw new Error("No file provided for upload");
        }

        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(file)) {
            throw new Error(`File does not exist: ${file}`);
        }

        console.log("File exists, proceeding with upload...");
        const uploadResult = await cloudinary.uploader.upload(file);
        console.log("Cloudinary upload successful:", uploadResult.url);
        return uploadResult.url;
    } catch (error) {
        console.error("=== Cloudinary upload error ===");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
}

module.exports = { cloudinaryFileUpload: cloudinaryFileUpload };