const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Gender = require("./Gender");

const Profile = sequelize.define(
  "Profile",
  {
    profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    profile_picture_url: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    practice_license_url: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "profiles",
    timestamps: false,
  }
);

module.exports = Profile;
