const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductCategory extends Model {
    static associate(models) {
      // Liên kết với Product và Category
      ProductCategory.belongsTo(models.Product, { foreignKey: 'product_id' , as: 'products'});
      ProductCategory.belongsTo(models.Category, { foreignKey: 'category_id', as: 'categorys'});
    }
  }

  ProductCategory.init({
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
    category_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'ProductCategories',
    timestamps: true
  });

  return ProductCategory;
};
