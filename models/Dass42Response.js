const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Dass42Result = require("./Dass42Result");
const Dass42Question = require("./Dass42Question");

const Dass42Response = sequelize.define(
  "Dass42Response",
  {
    response_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 3,
      },
    },
  },
  {
    tableName: "dass42_responses",
    timestamps: false,
  }
);

module.exports = Dass42Response;
