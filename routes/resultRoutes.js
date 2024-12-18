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
// router.get(
//   "/history/:patient_id",
//   authenticate,
//   resultsController.getResultsHistory
// );

// Mendapatkan hasil tes berdasarkan patient_id
router.get("/results-user", authenticate, resultsController.getResultByPatientId);

// // // Mendapatkan hasil tes berdasarkan result_id
// router.get("/result/:result_id", authenticate, resultsController.getResultById);

// Endpoint untuk mendapatkan hasil tes berdasarkan psikolog_id (untuk satu hasil tes)
router.get("/results-psikolog", authenticate, resultsController.getResultByPsikologId);

router.get("/all-results", authenticate, resultsController.getAllResult);

module.exports = router;