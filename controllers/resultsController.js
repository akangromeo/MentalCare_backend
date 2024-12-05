const Dass42Result = require("../models/Dass42Result");

// Mengambil hasil tes terbaru dari pasien
exports.getLatestResult = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Mengambil hasil tes terbaru berdasarkan patient_id
    const result = await Dass42Result.findOne({
      where: { patient_id },
      order: [["date_taken", "DESC"]], // Mengurutkan berdasarkan tanggal tes terbaru
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "No result found for this patient" });
    }

    // Mengembalikan hasil tes yang ditemukan
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengambil semua hasil tes untuk pasien (riwayat)
exports.getResultsHistory = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Mengambil semua hasil tes berdasarkan patient_id
    const results = await Dass42Result.findAll({
      where: { patient_id },
      order: [["date_taken", "DESC"]], // Mengurutkan berdasarkan tanggal tes terbaru
    });

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this patient" });
    }

    // Mengembalikan riwayat hasil tes
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
