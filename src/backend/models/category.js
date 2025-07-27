const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      // Nhiều-nhiều với Product thông qua bảng ProductCategory
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: "category_id",
        as: "products",
      });
    }
  }

  Category.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      icon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories",
      timestamps: true,
    }
  );

  return Category;
};
