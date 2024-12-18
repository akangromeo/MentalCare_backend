const Dass42Result = require("../models/Dass42Result");
const Dass42Response = require("../models/Dass42Response");
const Dass42Question = require("../models/Dass42Question");
const Category = require("../models/Category");
const Profile = require("../models/Profile");



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
// exports.getResultsHistory = async (req, res) => {
//   try {
//     const { patient_id } = req.params;

//     // Mengambil semua hasil tes berdasarkan patient_id
//     const results = await Dass42Result.findAll({
//       where: { patient_id },
//       order: [["date_taken", "DESC"]], // Mengurutkan berdasarkan tanggal tes terbaru
//     });

//     if (!results || results.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No results found for this patient" });
//     }

//     // Mengembalikan riwayat hasil tes
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getResultByPatientId = async (req, res) => {
  const patient_id = req.user.user_id; // Mendapatkan ID pasien dari JWT

  try {
    // Mencari hasil tes berdasarkan patient_id
    const results = await Dass42Result.findAll({
      where: { patient_id },
      include: [
        {
          model: Dass42Response,
          include: [
            {
              model: Dass42Question, // Tidak perlu alias lagi
              include: [Category], // Menyertakan kategori untuk pertanyaan
            },
          ],
        },
      ],
      order: [["date_taken", "DESC"]], // Mengurutkan berdasarkan tanggal tes diambil
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No test results found" });
    }

    // Menyusun response untuk hasil tes
    const resultData = results.map((result) => {
      return {
        result_id: result.result_id,
        patient_id: result.patient_id,
        psikolog_id: result.psikolog_id,
        depression_score: result.depression_score,
        anxiety_score: result.anxiety_score,
        stress_score: result.stress_score,
        date_taken: result.date_taken,
        
      };
    });

    res.json(resultData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};




exports.getResultByPsikologId = async (req, res) => {
  const psikolog_id = req.user.user_id; // Mendapatkan ID psikolog dari JWT

  try {
    // Mencari hasil tes berdasarkan psikolog_id
    const results = await Dass42Result.findAll({
      where: { psikolog_id },
      include: [
        {
          model: Dass42Response,
          include: [
            {
              model: Dass42Question, // Mengambil pertanyaan DASS42
              include: [Category], // Mengambil kategori dari setiap pertanyaan
            },
          ],
        },
        {
          model: Profile, // Menambahkan join ke tabel Profile
          as: "patient_profile", // Alias untuk relasi profil pasien
          attributes: ["name", "phone",], // Atribut yang ingin diambil
        },
      ],
      order: [["date_taken", "DESC"]], // Mengurutkan berdasarkan tanggal tes diambil
    });

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: "No test results found for this psikolog_id",
        psikolog_id,
      });
    }

    // Menyusun response untuk hasil tes beserta profil pasien
    const resultData = results.map((result) => {
      return {
        result_id: result.result_id,
        patient_id: result.patient_id,
        psikolog_id: result.psikolog_id,
        depression_score: result.depression_score,
        anxiety_score: result.anxiety_score,
        stress_score: result.stress_score,
        date_taken: result.date_taken,
        name: result.patient_profile ? result.patient_profile.name : null,
        
        phone: result.patient_profile ? result.patient_profile.phone : null, // Jika profil tidak ditemukan
      };
    });

    res.json(resultData);
  } catch (error) {
    console.error("Error fetching results by psikolog_id: ", error);
    res.status(500).json({ error: error.message });
  }
};

