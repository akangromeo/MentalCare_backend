const cloudinary = require('../config/cloudinaryConfig'); // Jalur yang benar ke file cloudinary.js

// Fungsi untuk mengunggah file ke Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'profile_pictures',
      resource_type: 'image',
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

module.exports = uploadToCloudinary;