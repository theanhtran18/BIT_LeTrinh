const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      // Nhiều-nhiều với Order thông qua bảng OrderProduct
      Product.belongsToMany(models.Order, {
        through: models.OrderProduct,
        foreignKey: "product_id",
        otherKey: "order_id",
        as: "productOrders", // Alias để phân biệt khi truy vấn
      });

      // Các liên kết khác
      Product.belongsToMany(models.Variant, {
        through: models.ProductVariant,
        foreignKey: "product_id",
        otherKey: "variant_id",
        as: "variants",
      });
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: "product_id",
        otherKey: "category_id",
        as: "categories",
      });
    }
  }

  Product.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
    }
  );

  return Product;
};
