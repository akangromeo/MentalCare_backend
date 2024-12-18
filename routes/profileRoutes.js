const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authenticate = require("../middleware/authenticate");

// Route untuk mengambil profil pengguna
router.get("/profile", authenticate, profileController.getProfile);

// // Route untuk memperbarui profil pengguna
// router.put("/profile", authenticate, profileController.updateProfile);

// Route untuk memperbarui nama pengguna
router.put("/profile/name", authenticate, profileController.updateName);

// Route untuk memperbarui tanggal lahir pengguna
router.put("/profile/birthdate", authenticate, profileController.updateBirthDate);

// Route untuk memperbarui alamat pengguna
router.put("/profile/address", authenticate, profileController.updateAddress);

// Route untuk memperbarui nomor telepon pengguna
router.put("/profile/phone", authenticate, profileController.updatePhone);

// Route untuk memperbarui gender pengguna
router.put("/profile/gender", authenticate, profileController.updateGender);



module.exports = router;
