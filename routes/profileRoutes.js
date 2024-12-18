const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authenticate = require("../middleware/authenticate");

// Route untuk mengambil profil pengguna
router.get("/profile", authenticate, profileController.getProfile);

// Route untuk memperbarui profil pengguna
router.put("/profile", authenticate, profileController.updateProfile);



module.exports = router;
