const db = require("../models");
const Profile = db.Profile;
const User = db.User;
const Gender = db.Gender;

// Fungsi untuk mengambil profil pengguna
exports.getProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const profile = await Profile.findOne({
      where: { user_id: userId },
      include: [User, Gender],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui nama pengguna
exports.updateName = async (req, res) => {
  const userId = req.user.user_id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama tidak boleh kosong." });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.name = name;
    await profile.save();

    res.status(200).json({ message: "Nama berhasil diperbarui.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui tanggal lahir pengguna
exports.updateBirthDate = async (req, res) => {
  const userId = req.user.user_id;
  const { birth_date } = req.body;

  if (!birth_date) {
    return res.status(400).json({ message: "Tanggal lahir tidak boleh kosong." });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.birth_date = birth_date;
    await profile.save();

    res.status(200).json({ message: "Tanggal lahir berhasil diperbarui.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui alamat pengguna
exports.updateAddress = async (req, res) => {
  const userId = req.user.user_id;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Alamat tidak boleh kosong." });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.address = address;
    await profile.save();

    res.status(200).json({ message: "Alamat berhasil diperbarui.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui nomor telepon pengguna
exports.updatePhone = async (req, res) => {
  const userId = req.user.user_id;
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Nomor telepon tidak boleh kosong." });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.phone = phone;
    await profile.save();

    res.status(200).json({ message: "Nomor telepon berhasil diperbarui.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui gender pengguna
exports.updateGender = async (req, res) => {
  const userId = req.user.user_id;
  const { gender_id } = req.body;

  if (!gender_id) {
    return res.status(400).json({ message: "ID gender tidak boleh kosong." });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.gender_id = gender_id;
    await profile.save();

    res.status(200).json({ message: "Gender berhasil diperbarui.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};


// Fungsi untuk memperbarui URL gambar profil
exports.updateProfilePicture = async (req, res) => {
  const userId = req.user.user_id;
  const { profile_picture_url } = req.body;

  if (!profile_picture_url) {
    return res.status(400).json({ message: "URL gambar profil tidak boleh kosong." });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.profile_picture_url = profile_picture_url;
    await profile.save();

    res.status(200).json({ message: "Gambar profil berhasil diperbarui.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};

// Fungsi untuk memperbarui URL lisensi praktik
exports.updatePracticeLicense = async (req, res) => {
  const userId = req.user.user_id;
  const { practice_license_url } = req.body;

  if (!practice_license_url) {
    return res.status(400).json({ message: "URL lisensi praktik tidak boleh kosong." });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    profile.practice_license_url = practice_license_url;
    await profile.save();

    res.status(200).json({ message: "Lisensi praktik berhasil diperbarui.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
  }
};
