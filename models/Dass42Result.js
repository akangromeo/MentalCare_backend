const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Dass42Result = sequelize.define(
  "Dass42Result",
  {
    result_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: { type: DataTypes.INTEGER, allowNull: false },
    psikolog_id: { type: DataTypes.INTEGER },
    depression_score: { type: DataTypes.INTEGER, allowNull: false },
    anxiety_score: { type: DataTypes.INTEGER, allowNull: false },
    stress_score: { type: DataTypes.INTEGER, allowNull: false },
    date_taken: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    notes: { type: DataTypes.TEXT },
  },
  {
    tableName: "dass42_results",
    timestamps: false,
  }
);

module.exports = Dass42Result;
