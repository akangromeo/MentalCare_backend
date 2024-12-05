const db = require("../models");
const Profile = db.Profile;
const User = db.User;
const Gender = db.Gender;

// Fungsi untuk mengambil profil pengguna
exports.getProfile = async (req, res) => {
  const userId = req.user.user_id; // Ambil user_id dari JWT yang sudah diverifikasi oleh middleware

  try {
    // Mencari profil berdasarkan user_id
    const profile = await Profile.findOne({
      where: { user_id: userId },
      include: [User, Gender], // Termasuk informasi dari tabel User dan Gender
    });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan" });
    }

    // Kirimkan profil pengguna yang ditemukan
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk memperbarui profil pengguna
exports.updateProfile = async (req, res) => {
  const userId = req.user.user_id; // Ambil user_id dari JWT
  const {
    name,
    birth_date,
    address,
    phone,
    gender_id,
    profile_picture_url,
    practice_license_url,
  } = req.body;

  try {
    // Mencari profil pengguna berdasarkan user_id
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan" });
    }

    // Memperbarui informasi profil dengan data dari body request
    profile.name = name || profile.name;
    profile.birth_date = birth_date || profile.birth_date;
    profile.address = address || profile.address;
    profile.phone = phone || profile.phone;
    profile.gender_id = gender_id || profile.gender_id;
    profile.profile_picture_url =
      profile_picture_url || profile.profile_picture_url;
    profile.practice_license_url =
      practice_license_url || profile.practice_license_url;

    // Menyimpan perubahan profil
    await profile.save();

    // Kirimkan data profil yang telah diperbarui
    res.status(200).json({ message: "Profil berhasil diperbarui", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
