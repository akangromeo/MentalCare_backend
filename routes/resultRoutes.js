const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/resultsController");
const authenticate = require("../middleware/authenticate"); // Middleware untuk autentikasi

// Mendapatkan hasil tes terbaru dari pasien
router.get(
  "/latest/:patient_id",
  authenticate,
  resultsController.getLatestResult
);

// Mendapatkan riwayat hasil tes pasien
router.get(
  "/history/:patient_id",
  authenticate,
  resultsController.getResultsHistory
);

module.exports = router;
