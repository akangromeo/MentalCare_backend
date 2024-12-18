const express = require("express");
const router = express.Router();
const dass42Controller = require("../controllers/dass42Controller");
const authenticate = require("../middleware/authenticate");

// Endpoint untuk mengambil soal tes
router.get("/questions", authenticate, dass42Controller.getQuestions);

router.put("/questions/:id", authenticate, dass42Controller.updateQuestion);

router.put(
	"/questions/:id/delete",
	authenticate,
	dass42Controller.softDeleteQuestion
);

// Endpoint untuk mengirimkan hasil tes (jawaban pengguna)
router.post("/submit", authenticate, dass42Controller.submitTest);

// Mendapatkan hasil tes berdasarkan patient_id
router.get("/result", authenticate, dass42Controller.getResultByPatientId);

// Mendapatkan hasil tes berdasarkan result_id
router.get("/result/:result_id", authenticate, dass42Controller.getResultById);

module.exports = router;
