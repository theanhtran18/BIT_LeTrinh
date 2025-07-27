const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductVariant extends Model {
    static associate(models) {
      // Liên kết với Product và Variant
      ProductVariant.belongsTo(models.Product, { foreignKey: 'product_id' , as: 'product'});
      ProductVariant.belongsTo(models.Variant, { foreignKey: 'variant_id', as: 'variant'});
    }
  }

  ProductVariant.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    variant_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Variants',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'ProductVariants',
    timestamps: true
  });

  return ProductVariant;
};
