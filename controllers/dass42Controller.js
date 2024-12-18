const sequelize = require("../config/database");
const Dass42Question = require("../models/Dass42Question");
const Dass42Response = require("../models/Dass42Response");
const Dass42Result = require("../models/Dass42Result");
const Category = require("../models/Category"); // Model kategori jika ada relasi

// Mendapatkan daftar pertanyaan DASS-42
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Dass42Question.findAll({
      include: [
        {
          model: Category, // Pastikan relasi ke kategori ada
          attributes: ["category_name"],
        },
      ],
      order: [["question_order", "ASC"]],
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
	try {
		const { id } = req.params; // Ambil ID dari parameter URL
		const { question_text, question_order, category_id } = req.body; // Data yang diupdate

		// Cari pertanyaan berdasarkan ID
		const question = await Dass42Question.findByPk(id);

		// Jika pertanyaan tidak ditemukan
		if (!question) {
			return res.status(404).json({
				message: "Question not found",
				details: `No question found with the ID: ${id}`,
			});
		}

		// Validasi input: Pastikan data yang dikirim sesuai dengan format yang diharapkan
		if (!question_text || !question_order || !category_id) {
			return res.status(400).json({
				message: "Invalid input data",
				details:
					"Fields question_text, question_order, and category_id are required.",
			});
		}

		// Update data pertanyaan
		question.question_text = question_text;
		question.question_order = question_order;
		question.category_id = category_id;

		// Simpan perubahan ke database
		await question.save();

		// Kirim respon sukses dengan detail data yang diperbarui
		res.status(200).json({
			message: "Update pertanyaan berhasil!",
			data: {
				id: question.question_id,
				question_text: question.question_text,
				question_order: question.question_order,
				category_id: question.category_id,
			},
		});
	} catch (error) {
		// Tangani error tak terduga
		res.status(500).json({
			status: "error",
			code: 500,
			message: "Internal server error",
			details: error.message,
		});
	}
};

exports.softDeleteQuestion = async (req, res) => {
	try {
		const { id } = req.params;

		// Mencari pertanyaan berdasarkan ID
		const question = await Dass42Question.findByPk(id);

		// Jika pertanyaan tidak ditemukan
		if (!question) {
			return res.status(404).json({ error: "Pertanyaan tidak ditemukan" });
		}

		// Update kolom is_deleted menjadi true
		question.is_deleted = true;

		// Simpan perubahan ke database
		await question.save();

		// Mengembalikan respons sukses
		res.json({ message: "Pertanyaan berhasil dihapus" });
	} catch (error) {
		// Menangani kesalahan
		res.status(500).json({ error: error.message });
	}
};

// Mengumpulkan jawaban dan menyimpan hasil tes
exports.submitTest = async (req, res) => {
  const { responses, psikolog_id } = req.body;
  const patient_id = req.user.user_id; // ID pengguna dari JWT

  // Validasi input
  if (!responses || responses.length === 0) {
    return res.status(400).json({ message: "No responses provided" });
  }

  // Skor sementara untuk setiap kategori
  let depression_score = 0;
  let anxiety_score = 0;
  let stress_score = 0;

  // Menggunakan transaksi untuk menjaga integritas data
  const transaction = await sequelize.transaction();

  try {
    // 1. Simpan hasil tes terlebih dahulu
    const result = await Dass42Result.create(
      {
        patient_id,
        psikolog_id,
        depression_score: 0, // Skor sementara
        anxiety_score: 0, // Skor sementara
        stress_score: 0, // Skor sementara
        date_taken: new Date(),
      },
      { transaction }
    );

    // 2. Ambil kategori terlebih dahulu untuk menghindari query berulang
    const categories = await Category.findAll();

    // 3. Simpan respons jawaban dan hitung skor
    for (const response of responses) {
      const { question_id, score } = response;

      // Menyimpan respons ke tabel `dass42_responses`
      await Dass42Response.create(
        {
          result_id: result.result_id,
          question_id,
          score,
        },
        { transaction }
      );

      // Cari kategori berdasarkan question_id
      const question = await Dass42Question.findByPk(question_id);

      if (!question) {
        console.log(`Question with ID ${question_id} not found`);
        continue; // Jika tidak ditemukan, lanjutkan ke pertanyaan berikutnya
      }

      // Tentukan kategori dan tambahkan skor
      const category = categories.find(
        (c) => c.category_id === question.category_id
      );

      if (!category) {
        console.log(`Category for question ID ${question_id} not found`);
        continue; // Jika kategori tidak ditemukan, lanjutkan ke pertanyaan berikutnya
      }

      if (category.category_name === "Depresi") {
        depression_score += score;
      } else if (category.category_name === "Kecemasan") {
        anxiety_score += score;
      } else if (category.category_name === "Stres") {
        stress_score += score;
      }
    }

    // 4. Memperbarui hasil tes dengan skor yang telah dihitung
    await result.update(
      {
        depression_score,
        anxiety_score,
        stress_score,
      },
      { transaction }
    );

    // 5. Commit transaksi jika semua berhasil
    await transaction.commit();

    // 6. Kembalikan hasil tes yang sudah diperbarui
    res.json({
      message: "Test submitted successfully",
      result: {
        depression_score,
        anxiety_score,
        stress_score,
      },
    });
  } catch (error) {
    // Rollback transaksi jika ada error
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

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
        responses: result.dass42_responses
          ? result.dass42_responses.map((response) => {
              return {
                question_id: response.question_id,
                score: response.score,
                category:
                  response.dass42_question && response.dass42_question.category
                    ? response.dass42_question.category.category_name
                    : null, // Menangani null jika kategori tidak ada
              };
            })
          : [], // Jika tidak ada responses, kembalikan array kosong
      };
    });

    res.json(resultData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getResultByPsikologId = async (req, res) => {
  const psikolog_id = req.user.user_id; // Mendapatkan ID pasien dari JWT

  try {
    // Mencari hasil tes berdasarkan patient_id
    const results = await Dass42Result.findAll({
      where: { psikolog_id },
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
        responses: result.dass42_responses
          ? result.dass42_responses.map((response) => {
              return {
                question_id: response.question_id,
                score: response.score,
                category:
                  response.dass42_question && response.dass42_question.category
                    ? response.dass42_question.category.category_name
                    : null, // Menangani null jika kategori tidak ada
              };
            })
          : [], // Jika tidak ada responses, kembalikan array kosong
      };
    });

    res.json(resultData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getResultById = async (req, res) => {
  const { result_id } = req.params;

  try {
    // Mencari hasil tes berdasarkan result_id
    const result = await Dass42Result.findByPk(result_id, {
      include: [
        {
          model: Dass42Response,
          as: "dass42_responses", // Alias sesuai dengan asosiasi
          include: [
            {
              model: Dass42Question,
              as: "dass42_question", // Alias yang sesuai
              include: [
                {
                  model: Category,
                  as: "category", // Alias untuk kategori
                  attributes: ["category_name"], // Hanya ambil nama kategori
                },
              ],
            },
          ],
        },
      ],
    });

    if (!result) {
      return res.status(404).json({ message: "Test result not found" });
    }

    // Menyusun response untuk hasil tes
    const resultData = {
      result_id: result.result_id,
      patient_id: result.patient_id,
      psikolog_id: result.psikolog_id,
      depression_score: result.depression_score,
      anxiety_score: result.anxiety_score,
      stress_score: result.stress_score,
      date_taken: result.date_taken,
      responses: result.dass42_responses.map((response) => {
        return {
          question_id: response.question_id,
          score: response.score,
          category: response.dass42_question.category
            ? response.dass42_question.category.category_name
            : null, // Menangani null jika tidak ada kategori
        };
      }),
    };

    res.json(resultData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
