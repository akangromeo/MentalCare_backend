const cloudinary = require('cloudinary').v2;
require("dotenv").config();

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Gantilah dengan cloud name Anda
  api_key: process.env.API_KEY,       // Gantilah dengan API key Anda
  api_secret: process.env.API_SECRET,  // Gantilah dengan API secret Anda
});

module.exports = cloudinary;