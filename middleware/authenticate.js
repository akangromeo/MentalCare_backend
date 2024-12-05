const jwt = require("jsonwebtoken");
require("dotenv").config(); // Pastikan dotenv diinisialisasi untuk membaca .env

const authenticate = (req, res, next) => {
  // Ambil token dari header Authorization
  const token = req.headers["authorization"]?.split(" ")[1];

  // Jika token tidak ada, kirimkan respons error
  if (!token) {
    return res.status(403).json({ error: "Token tidak disertakan" });
  }

  try {
    // Verifikasi token menggunakan secret key yang ada di .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Jika token valid, simpan informasi user yang ter-decode ke dalam request
    req.user = decoded;

    // Lanjutkan ke rute berikutnya
    next();
  } catch (err) {
    console.error("Gagal verifikasi token:", err);
    return res
      .status(401)
      .json({ error: "Token tidak valid atau kedaluwarsa" });
  }
};

module.exports = authenticate;
