const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// Konfigurasi Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folder = file.fieldname === "profile_picture" 
      ? "profile_picture" 
      : "practice_license";

    // Mendapatkan format asli file
    const format = file.mimetype.split("/")[1]; // Mengambil ekstensi dari mimetype, misal "image/jpeg" -> "jpeg"

    return {
      folder: folder,
      format: format === "jpeg" ? "jpg" : format, // Mengubah "jpeg" menjadi "jpg" jika diperlukan
      public_id: `${folder}_${Date.now()}`, // Nama file unik berdasarkan timestamp
    };
  },
});

// Konfigurasi Multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Filter untuk memastikan file adalah gambar
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung. Hanya PNG, JPEG, atau JPG yang diperbolehkan."), false);
    }
  },
});

module.exports = upload;
