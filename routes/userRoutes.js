// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate"); // Middleware untuk autentikasi

// Update psikolog yang dipilih oleh pasien

router.get("/get-all-patients", authenticate, userController.getAllPasien);

router.get("/get-all-psikologs", authenticate, userController.getAllPsikolog);

router.put("/:user_id/status", authenticate, userController.updateUserStatus);

router.get('/psikolog/:id', authenticate, userController.getPsikologById);

router.get("/get-all-roles",  userController.getRoles);

router.get("/get-all-status", authenticate, userController.getStatusPsikolog);

module.exports = router;
