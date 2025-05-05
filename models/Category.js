const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "category",
    timestamps: false,
  }
);

Category.associate = function(models) {
  Category.hasMany(models.Dass42Question, {
    foreignKey: 'category_id',
  });
};

module.exports = Category;
