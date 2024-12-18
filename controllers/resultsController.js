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
          model: User, // Join ke tabel Users
          as: "patient_user", // Alias untuk join ke User
          attributes: ["user_id"], // Ambil user_id untuk koneksi ke Profiles
          include: [
            {
              model: Profile, // Join ke tabel Profiles
              as: "profile", // Alias untuk join ke Profile
              attributes: ["name", "birth_date","phone"], // Atribut profil
            },
          ],
        },
      ],
      order: [["date_taken", "DESC"]], // Mengurutkan berdasarkan tanggal tes
    });

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: "No test results found for this psikolog_id",
        psikolog_id,
      });
    }

    // Menyusun response
    const resultData = results.map((result) => {
      const profile = result.patient_user?.profile; // Ambil profile dari relasi User
      return {
        result_id: result.result_id,
        patient_id: result.patient_id,
        psikolog_id: result.psikolog_id,
        depression_score: result.depression_score,
        anxiety_score: result.anxiety_score,
        stress_score: result.stress_score,
        date_taken: result.date_taken,
        // Data profil
        name: profile ? profile.name : null,
        birth_date: profile ? profile.birth_date : null,
       
        phone: profile ? profile.phone : null,

      };
    });

    res.json(resultData);
  } catch (error) {
    console.error("Error fetching results by psikolog_id: ", error);
    res.status(500).json({ error: error.message });
  }
};

