const sequelize = require("../config/database");
const Dass42Question = require("../models/Dass42Question");
const Dass42Response = require("../models/Dass42Response");
const Dass42Result = require("../models/Dass42Result");
const Category = require("../models/Category");
const moment = require("moment");
const { Sequelize, Op } = require("sequelize");

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

exports.createQuestion = async (req, res) => {
  try {
    const { question_text, category_id } = req.body;

    // Validasi: pastikan question_text dan category_id ada di request body
    if (!question_text || !category_id) {
      return res.status(400).json({
        message: "question_text dan category_id wajib diisi",
      });
    }

    // Ambil nilai question_order tertinggi
    const lastQuestion = await Dass42Question.findOne({
      order: [["question_order", "DESC"]], // Urutkan berdasarkan question_order secara menurun
    });

    // Tentukan question_order untuk pertanyaan baru
    let newQuestionOrder = 1; // Jika tidak ada pertanyaan sebelumnya, set question_order ke 1
    if (lastQuestion) {
      newQuestionOrder = lastQuestion.question_order + 1; // Tambah 1 dari question_order terakhir
    }

    // Buat pertanyaan baru dengan question_order otomatis
    const newQuestion = await Dass42Question.create({
      question_text,
      question_order: newQuestionOrder,
      category_id, // Pastikan ini sesuai dengan foreign key di relasi
    });

    // Kembalikan respons dengan data pertanyaan baru
    res.status(201).json({
      message: "Soal berhasil dibuat",
      data: newQuestion,
    });
  } catch (error) {
    // Menangani kesalahan
    res.status(500).json({ message: error.message });
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

exports.getCategory = async (req, res) => {
  try {
    const CategoryList = await Category.findAll({
      order: [["category_id", "ASC"]],
    });

    const CategoryData = CategoryList.map((category) => {
      return {
        category_id: category.category_id,
        category_name: category.category_name,
      };
    });

    res.json(CategoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Mengumpulkan jawaban dan menyimpan hasil tes
exports.submitTest = async (req, res) => {
  const { responses, psikolog_id } = req.body;
  const patient_id = req.user.user_id;

  if (!responses || responses.length === 0) {
    return res.status(400).json({ message: "No responses provided" });
  }

  const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const transaction = await sequelize.transaction();

  try {
    const result = await db.Dass42Result.create(
      {
        patient_id,
        psikolog_id,
        depression_score: 0,
        anxiety_score: 0,
        stress_score: 0,
        date_taken: formattedDate,
      },
      { transaction }
    );

    // 1. Optimized query to fetch questions and categories in one request
    const questionsWithCategories = await db.Dass42Question.findAll({
      attributes: ["question_id", "category_id"], // Only fetch the necessary columns
      include: [
        {
          model: db.Category,
          as: "category",
          attributes: ["category_id"], // Only fetch category_id
          required: true,
        },
      ],
      where: {
        question_id: { [Op.in]: responses.map((r) => r.question_id) },
      },
      order: [["question_id", "ASC"]],
    });

    // 2. Prepare data for bulk insert of responses
    const responseBatch = responses.map((response) => ({
      result_id: result.result_id,
      question_id: response.question_id,
      score: response.score,
    }));

    // 3. Bulk insert responses
    await db.Dass42Response.bulkCreate(responseBatch, { transaction });

    // 4. Calculate scores efficiently
    let depression_score = 0;
    let anxiety_score = 0;
    let stress_score = 0;

    // Create a map for faster category lookup
    const categoryMap = new Map();
    questionsWithCategories.forEach((question) => {
      categoryMap.set(question.question_id, question.category.category_id);
    });

    for (const response of responses) {
      const categoryId = categoryMap.get(response.question_id);
      const score = response.score;

      if (categoryId === 1) {
        // 1 = Depresi
        depression_score += score;
      } else if (categoryId === 2) {
        // 2 = Kecemasan
        anxiety_score += score;
      } else if (categoryId === 3) {
        // 3 = Stres
        stress_score += score;
      }
    }

    // 5. Update result with calculated scores
    await result.update(
      {
        depression_score,
        anxiety_score,
        stress_score,
      },
      { transaction }
    );

    // 6. Commit the transaction
    await transaction.commit();

    // 7. Send the response
    res.json({
      message: "Test submitted successfully",
      result: {
        result_id: result.result_id,
        depression_score,
        anxiety_score,
        stress_score,
      },
    });
  } catch (error) {
    // 8. Rollback the transaction on error
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateResultWithPsikolog = async (req, res) => {
  const { result_id, psikolog_id } = req.body; // Ambil result_id dan psikolog_id dari body

  // Validasi input
  if (!result_id) {
    return res.status(400).json({ message: "Result ID is required" });
  }

  if (!psikolog_id) {
    return res.status(400).json({ message: "Psikolog ID is required" });
  }

  // Mulai transaksi
  const transaction = await sequelize.transaction();

  try {
    // 1. Cari hasil tes berdasarkan result_id
    const result = await Dass42Result.findByPk(result_id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // 2. Perbarui hasil tes dengan psikolog_id
    await result.update(
      {
        psikolog_id, // Tambahkan psikolog_id ke hasil tes
      },
      { transaction }
    );

    // 3. Commit transaksi
    await transaction.commit();

    // 4. Kembalikan respons berhasil
    res.json({
      message: "Result updated successfully",
      result: result,
    });
  } catch (error) {
    // Rollback jika ada error
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getResponsesByResultId = async (req, res) => {
  const { result_id } = req.params;

  try {
    const responses = await Dass42Response.findAll({
      where: { result_id: result_id },
      attributes: ["response_id", "result_id", "question_id", "score"],
    });

    if (responses) {
      res.status(200).json(responses);
    } else {
      res
        .status(404)
        .json({ message: "Tidak ada respons ditemukan untuk result_id ini." });
    }
  } catch (error) {
    console.error("Error fetching responses:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil respons." });
  }
};
