const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dabto2xwj",
  api_key: "718864186336446",
  api_secret: "9dA7CB5vhulDNulhRYgVrsFxggM",
});

// Upload an image
async function cloudinaryFileUpload(file) {
  const uploadResult = await cloudinary.uploader.upload(file).catch((error) => {
    console.error(error);
  });
  return uploadResult.url;
}

module.exports = { cloudinaryFileUpload };