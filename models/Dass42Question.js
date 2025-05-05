const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");

const Dass42Question = sequelize.define(
  "Dass42Question",
  {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question_text: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    question_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "dass42_questions",
    timestamps: false,
    defaultScope: {
      where: {
        is_deleted: false,
      },
    },
  }
);

// Dass42Question.associate = function(models) {
// 	Dass42Question.belongsTo(models.Category, {
// 	  foreignKey: 'category_id',
// 	  as: 'category',
// 	});
//   };

module.exports = Dass42Question;
