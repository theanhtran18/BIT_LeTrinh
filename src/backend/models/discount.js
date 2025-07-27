const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Discount extends Model {
    static associate(models) {
      // Một-nhiều với Order
      Discount.belongsToMany(models.Order, {
        through: models.OrderDiscount,
        foreignKey: "discount_id",
        as: "orders",
      });

      // Một-nhiều với DiscountCondition
      Discount.hasMany(models.DiscountCondition, {
        foreignKey: "discount_id",
        as: "conditions",
      });
    }
  }

  Discount.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM("percent", "value"),
        allowNull: false,
      },
      value: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Discount",
      tableName: "Discounts",
      timestamps: true,
    }
  );

  return Discount;
};
