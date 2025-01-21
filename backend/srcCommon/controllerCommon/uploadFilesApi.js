const { uploadToCloudinary } = require("../serviceCommon/uploadCloudinary");
const fs = require('fs');
const path = require('path');
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");


const uploadFilesApi = async (req, res) => {
    try {
      const uploadedFiles = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file))
      );
  
      // Delete temp files from upload/ directory
      req.files.forEach((file) => {
        fs.unlink(path.join(__dirname, '../../temp/upload/', file.filename), (err) => {
          if (err) {
            console.error(`Failed to delete temp file: ${file.filename}`, err);
          }
        });
      });
  
      return res.status(200).json(ApiResponse.success(uploadedFiles, "Files uploaded"));
    } catch (error) {
      return res.status(500).json(ApiError.error("Failed to upload files", error.message));
    }
  };

module.exports = { uploadFilesApi };