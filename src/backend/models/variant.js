const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Variant extends Model {
    static associate(models) {
      // Liên kết với Product
      Variant.belongsToMany(models.Product, {
        through: models.ProductVariant,
        foreignKey: "variant_id",
        as: "products",
      });
      // Một-nhiều với VariantOption
      Variant.hasMany(models.VariantOption, {
        foreignKey: "variant_id",
        as: "options",
      });
    }
  }

  Variant.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("multiple", "single"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Variant",
      tableName: "Variants",
      timestamps: true,
    }
  );

  return Variant;
};
