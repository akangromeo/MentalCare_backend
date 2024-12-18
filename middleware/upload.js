const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder tempat menyimpan file
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // Mengambil ekstensi file
    const filename = Date.now() + fileExt; // Membuat nama file unik
    cb(null, filename); // Menyimpan nama file yang telah diubah
  }
});

// Filter untuk memastikan file yang diupload adalah gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Mengizinkan file gambar
  } else {
    cb(new Error('File harus berupa gambar'), false); // Menolak file selain gambar
  }
};

const upload = multer({ storage, fileFilter });
module.exports = { upload };