const express = require("express");
const router = express.Router();
const dass42Controller = require("../controllers/dass42Controller");
const authenticate = require("../middleware/authenticate");

// Endpoint untuk mengambil soal tes
router.get("/questions", authenticate, dass42Controller.getQuestions);

router.post("/questions", authenticate, dass42Controller.createQuestion);

router.put("/questions/:id", authenticate, dass42Controller.updateQuestion);

router.put(
	"/questions/:id/delete",
	authenticate,
	dass42Controller.softDeleteQuestion
);

router.get("/category", authenticate, dass42Controller.getCategory);

// Endpoint untuk mengirimkan hasil tes (jawaban pengguna)
router.post("/submit", authenticate, dass42Controller.submitTest);

router.put("/choose-psikolog", authenticate, dass42Controller.updateResultWithPsikolog)

module.exports = router;
