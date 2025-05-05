const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

// Mengimpor semua model
const User = require("./User");
const Role = require("./Role");
const Status = require("./StatusPsikolog");
const Profile = require("./Profile");
const Gender = require("./Gender");
const Category = require("./Category");
const Dass42Question = require("./Dass42Question");
const Dass42Response = require("./Dass42Response");
const Dass42Result = require("./Dass42Result");

// Relasi antar model
User.belongsTo(Role, { foreignKey: "role_id" }); // Relasi antara User dan Role
User.belongsTo(Status, { foreignKey: "status_id" }); // Relasi antara User dan Status
User.hasOne(Profile, { foreignKey: "user_id" });

Profile.belongsTo(User, { foreignKey: "user_id" }); // Relasi antara Profile dan User
Profile.belongsTo(Gender, { foreignKey: "gender_id" }); // Relasi antara Profile dan Gender

Dass42Question.belongsTo(Category, { foreignKey: "category_id", as: "category" }); // Relasi antara Dass42Question dan Category

// Relasi antara Dass42Response dan Dass42Question
Dass42Response.belongsTo(Dass42Question, {
  foreignKey: "question_id",
}); // Relasi antara Dass42Response dan Dass42Question

// Relasi antara Dass42Response dan Dass42Result
Dass42Response.belongsTo(Dass42Result, { foreignKey: "result_id" }); // Relasi antara Dass42Response dan Dass42Result

// Relasi antara Dass42Result dan User (Pasien dan Psikolog)
Dass42Result.belongsTo(User, { foreignKey: "patient_id", as: "patient" }); // Relasi antara Dass42Result dan User (Pasien)
Dass42Result.belongsTo(User, { foreignKey: "psikolog_id", as: "psikolog" }); // Relasi antara Dass42Result dan User (Psikolog)

// Relasi tambahan yang mungkin perlu:
// Relasi antara Dass42Result dan Dass42Response (Satu hasil tes bisa memiliki banyak respons)
Dass42Result.hasMany(Dass42Response, {
  foreignKey: "result_id",
}); // Relasi antara Dass42Result dan Dass42Response

// Relasi antara Category dan Dass42Question (Satu kategori bisa memiliki banyak pertanyaan)
Category.hasMany(Dass42Question, { foreignKey: "category_id" }); // Relasi antara Category dan Dass42Question

// Menyusun objek untuk mempermudah akses model
const db = {
  sequelize,
  User,
  Role,
  Status,
  Profile,
  Gender,
  Category,
  Dass42Question,
  Dass42Response,
  Dass42Result,
};

// Mengekspor objek db sehingga bisa digunakan di tempat lain
module.exports = db;
