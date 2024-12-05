const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Gender = sequelize.define(
  "Gender",
  {
    gender_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gender_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "gender",
    timestamps: false,
  }
);

module.exports = Gender;
