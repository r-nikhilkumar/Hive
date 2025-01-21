const cloudinary = require('../../config/cloudinary');

const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "auto",
  });
  return {
    name: file.originalname,
    type: file.mimetype,
    url: result.secure_url,
  };
};

module.exports = { uploadToCloudinary };