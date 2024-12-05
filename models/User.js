const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Role = require("./Role");
const StatusPsikolog = require("./StatusPsikolog");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false, // Menyimpan waktu pembuatan dan update jika perlu
  }
);

module.exports = User;
