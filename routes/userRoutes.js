// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate"); // Middleware untuk autentikasi

// Update psikolog yang dipilih oleh pasien
router.put("/update-psikolog", authenticate, userController.choosePsikolog);

router.get("/get-all-patients", authenticate, userController.getAllPasien);

router.get("/get-all-psikologs", authenticate, userController.getAllPsikolog);

router.put("/:user_id/status", authenticate, userController.updateUserStatus);

module.exports = router;
