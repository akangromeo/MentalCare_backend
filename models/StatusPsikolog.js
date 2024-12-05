const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = sequelize.define(
  "Status",
  {
    status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "status_psikolog",
    timestamps: false,
  }
);

module.exports = Status;
