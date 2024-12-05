const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const Status = db.Status;
const Profile = db.Profile;
const Gender = db.Gender;
require("dotenv").config();

// Fungsi untuk registrasi pengguna baru
exports.register = async (req, res) => {
  const { email, password, role_id, gender_id } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tentukan status_id berdasarkan role_id
    const status_id = role_id === 2 ? 2 : null; // Jika role_id == 2, status_id = 2, selain itu null

    // Buat user baru
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      role_id,
      status_id, // Menetapkan status_id sesuai dengan role_id
    });

    // Buat profil baru untuk user yang baru terdaftar
    const newProfile = await Profile.create({
      user_id: newUser.user_id,
      gender_id: gender_id || null, // Bisa disesuaikan, misal gender default null
    });

    // Jika berhasil, kirimkan respon sukses
    res.status(201).json({
      message: "Registrasi berhasil, profil telah dibuat",
      user: {
        email: newUser.email,
        user_id: newUser.user_id,
        profile_id: newProfile.profile_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk login dan menghasilkan JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Mencari pengguna berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    // Membandingkan password yang diberikan dengan password yang sudah di-hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    // Membuat JWT dengan payload berisi user_id
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET
    );

    // Mengirimkan token dalam respon
    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.user_id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
