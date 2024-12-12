const { profile } = require("console");
const { User, Profile, Role, Gender, Status } = require("../models");

//GET

exports.getAllPasien = async (req, res) => {
  try {
    // Ambil semua pasien berdasarkan role_id = 3 (misalnya, pasien)
    const pasienList = await User.findAll({
      where: { role_id: 3 }, // Hanya pasien
      include: {
        model: Profile, // Menyertakan profil
        required: false, // Pastikan tetap tampil meskipun tidak ada profil
      },
    });

    // Format response dengan data pasien dan profil
    const pasienData = pasienList.map((pasien) => {
      return {
        user_id: pasien.user_id,
        email: pasien.email,
        profile: pasien.Profile
          ? {
              profile_id: pasien.Profile.dataValues.profile_id,
              name: pasien.Profile.dataValues.name,
              birth_date: pasien.Profile.dataValues.birth_date,
              address: pasien.Profile.dataValues.address,
              phone: pasien.Profile.dataValues.phone,
              profile_picture_url:
                pasien.Profile.dataValues.profile_picture_url,
              practice_license_url:
                pasien.Profile.dataValues.practice_license_url,
            }
          : null, // Jika tidak ada profil, kirimkan null
      };
    });

    res.json(pasienData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.getAllPsikolog = async (req, res) => {
  try {
    // Ambil semua psikolog berdasarkan role_id = 2
    const psikologList = await User.findAll({
      where: { role_id: 2 }, // Hanya psikolog
      include: [
        {
          model: Profile, // Menyertakan profil
          required: false, // Pastikan tetap tampil meskipun tidak ada profil
        },
        {
          model: Status, // Menyertakan status psikolog
          required: false, // Pastikan tetap tampil meskipun tidak ada status
        },
      ],
    });

    // Format response dengan data psikolog dan profil
    const psikologData = psikologList.map((psikolog) => {
      return {
        user_id: psikolog.user_id,
        email: psikolog.email,
        profile: psikolog.Profile
          ? {
              profile_id: psikolog.Profile.dataValues.profile_id,
              name: psikolog.Profile.dataValues.name,
              birth_date: psikolog.Profile.dataValues.birth_date,
              address: psikolog.Profile.dataValues.address,
              phone: psikolog.Profile.dataValues.phone,
              profile_picture_url:
                psikolog.Profile.dataValues.profile_picture_url,
              practice_license_url:
                psikolog.Profile.dataValues.practice_license_url,
            }
          : null,
        status: psikolog.Status
          ? {
              status_id: psikolog.Status.dataValues.status_id,
              status_name: psikolog.Status.dataValues.status_name,
            }
          : null, // Jika tidak ada profil, kirimkan null
      };
    });

    res.json(psikologData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk memperbarui psikolog yang dipilih oleh pasien
exports.choosePsikolog = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Mengambil user_id dari JWT token
    const { psikolog_id } = req.body; // Mengambil psikolog_id dari body request

    // Cari pengguna berdasarkan user_id
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Pastikan hanya pengguna dengan role 'user' yang bisa memilih psikolog
    if (user.role_id !== 3) {
      // Role 3 berarti pasien (user)
      return res
        .status(403)
        .json({ message: "Only patients can select a psychologist" });
    }

    const psikolog = await user.findByPk(psikolog_id);
    if (!psikolog || psikolog.role_id !== 2 || psikolog.status !== "approved")
      // Update psikolog_id pada profil pengguna
      user.psikolog_id = psikolog_id || user.psikolog_id; // Update jika psikolog_id baru diberikan

    // Simpan perubahan
    await user.save();

    res.json({ message: "Psikolog updated successfully", user });
  } catch (error) {
    console.error("Error updating psikolog:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    // Log untuk debugging
    console.log("req.user:", req.user); // Cek isi dari req.user (harus ada role_id di sini)

    const { user_id } = req.params;
    const { status } = req.body;

    // Periksa apakah role_id adalah 1 (admin)
    if (req.user.role_id !== 1) {
      console.log("Unauthorized access attempt by user_id:", req.user.user_id); // Debugging untuk akses tidak sah
      return res
        .status(403)
        .json({ message: "Hanya Admin yang dapat merubah status user" });
    }

    // Cari user berdasarkan user_id
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Update status user
    user.status_id = status; // Pastikan `status_id` sesuai dengan kolom di DB
    await user.save();

    res.json({ message: `User ${user_id} status updated to ${status}`, user });
  } catch (error) {
    console.error("Error updating user status", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const Roleslist = await Role.findAll({
      include: [
        {
          model: Role,
        },
      ],
    });

    const RoleData = Roleslist.map((role) => {
      return {
        role_id: role.role_id,
        role_name: role.role_name,
      };
    });

    res.json(RoleData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
