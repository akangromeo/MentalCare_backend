const db = require("../models");
const User = db.User;
const Gender = db.Gender;
const Profile = require('../models/Profile');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const { upload } = require('../middleware/upload');

// Fungsi untuk mengambil profil pengguna
exports.getProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    console.log(`Mencari profil untuk user_id: ${userId}`);
    const profile = await Profile.findOne({
      where: { user_id: userId },
      include: [User, Gender],
    });

    if (!profile) {
      console.warn(`Profil tidak ditemukan untuk user_id: ${userId}`);
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error saat mengambil profil:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui nama pengguna
exports.updateName = async (req, res) => {
  const userId = req.user.user_id;
  const { name } = req.body;

  if (!name) {
    console.warn("Permintaan update nama tanpa nama.");
    return res.status(400).json({ message: "Nama tidak boleh kosong." });
  }

  try {
    console.log(`Memperbarui nama untuk user_id: ${userId} menjadi: ${name}`);
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      console.warn(`Profil tidak ditemukan untuk user_id: ${userId}`);
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.name = name;
    await profile.save();

    res.status(200).json({ message: "Nama berhasil diperbarui.", profile });
  } catch (error) {
    console.error("Error saat memperbarui nama:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui tanggal lahir pengguna
exports.updateBirthDate = async (req, res) => {
  const userId = req.user.user_id;
  const { birth_date } = req.body;

  if (!birth_date) {
    console.warn("Permintaan update tanggal lahir tanpa tanggal lahir.");
    return res.status(400).json({ message: "Tanggal lahir tidak boleh kosong." });
  }

  try {
    console.log(`Memperbarui tanggal lahir untuk user_id: ${userId} menjadi: ${birth_date}`);
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      console.warn(`Profil tidak ditemukan untuk user_id: ${userId}`);
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.birth_date = birth_date;
    await profile.save();

    res.status(200).json({ message: "Tanggal lahir berhasil diperbarui.", profile });
  } catch (error) {
    console.error("Error saat memperbarui tanggal lahir:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui alamat pengguna
exports.updateAddress = async (req, res) => {
  const userId = req.user.user_id;
  const { address } = req.body;

  if (!address) {
    console.warn("Permintaan update alamat tanpa alamat.");
    return res.status(400).json({ message: "Alamat tidak boleh kosong." });
  }

  try {
    console.log(`Memperbarui alamat untuk user_id: ${userId} menjadi: ${address}`);
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      console.warn(`Profil tidak ditemukan untuk user_id: ${userId}`);
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.address = address;
    await profile.save();

    res.status(200).json({ message: "Alamat berhasil diperbarui.", profile });
  } catch (error) {
    console.error("Error saat memperbarui alamat:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui nomor telepon pengguna
exports.updatePhone = async (req, res) => {
  const userId = req.user.user_id;
  const { phone } = req.body;

  if (!phone) {
    console.warn("Permintaan update nomor telepon tanpa nomor telepon.");
    return res.status(400).json({ message: "Nomor telepon tidak boleh kosong." });
  }

  try {
    console.log(`Memperbarui nomor telepon untuk user_id: ${userId} menjadi: ${phone}`);
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      console.warn(`Profil tidak ditemukan untuk user_id: ${userId}`);
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.phone = phone;
    await profile.save();

    res.status(200).json({ message: "Nomor telepon berhasil diperbarui.", profile });
  } catch (error) {
    console.error("Error saat memperbarui nomor telepon:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui gender pengguna
exports.updateGender = async (req, res) => {
  const userId = req.user.user_id;
  const { gender_id } = req.body;

  if (!gender_id) {
    console.warn("Permintaan update gender tanpa gender_id.");
    return res.status(400).json({ message: "ID gender tidak boleh kosong." });
  }

  try {
    console.log(`Memperbarui gender untuk user_id: ${userId} menjadi: ${gender_id}`);
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      console.warn(`Profil tidak ditemukan untuk user_id: ${userId}`);
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.gender_id = gender_id;
    await profile.save();

    res.status(200).json({ message: "Gender berhasil diperbarui.", profile });
  } catch (error) {
    console.error("Error saat memperbarui gender:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui gambar profil
exports.updateProfilePicture = [
  upload.single('profile_picture'), // Middleware untuk menangani upload file
  async (req, res) => {
    const userId = req.user.user_id;

    if (!req.file) {
      return res.status(400).json({ message: "Gambar profil tidak boleh kosong." });
    }

    try {
      // Mengunggah gambar ke Cloudinary
      const result = await uploadToCloudinary(req.file);

      // Cari profil berdasarkan user_id
      const profile = await Profile.findOne({ where: { user_id: userId } });

      if (!profile) {
        return res.status(404).json({ message: "Profil tidak ditemukan." });
      }

      // Menyimpan URL gambar yang diunggah ke Cloudinary
      profile.profile_picture_url = result.secure_url;  // Gambar berhasil diupload
      await profile.save();

      res.status(200).json({ message: "Gambar profil berhasil diperbarui.", profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
    }
  },
];

// Fungsi untuk memperbarui lisensi praktik
exports.updatePracticeLicense = [
  upload.single('practice_license'), // Middleware untuk menangani upload file
  async (req, res) => {
    const userId = req.user.user_id;

    if (!req.file) {
      return res.status(400).json({ message: "Lisensi praktik tidak boleh kosong." });
    }

    try {
      // Mengunggah lisensi praktik ke Cloudinary
      const result = await uploadToCloudinary(req.file);

      // Cari profil berdasarkan user_id
      const profile = await Profile.findOne({ where: { user_id: userId } });

      if (!profile) {
        return res.status(404).json({ message: "Profil tidak ditemukan." });
      }

      // Menyimpan URL lisensi praktik yang diunggah ke Cloudinary
      profile.practice_license_url = result.secure_url;
      await profile.save();

      res.status(200).json({ message: "Lisensi praktik berhasil diperbarui.", profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
    }
  },
];


exports.getGender = async (req, res) => {
  try {
    const Genderlist = await Gender.findAll({
      order: [["gender_id", "DESC"]],
    });

    const GenderData = Genderlist.map((gender) => {
      return {
        gender_id: gender.gender_id,
        gender_name: gender.gender_name,
      };
    });

    res.json(GenderData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
