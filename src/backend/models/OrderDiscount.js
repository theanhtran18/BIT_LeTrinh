const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class OrderDiscount extends Model {
    static associate(models) {
      // Liên kết với Order và Discount
      OrderDiscount.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
      OrderDiscount.belongsTo(models.Discount, {
        foreignKey: "discount_id",
        as: "discount",
      });
    }
  }

  OrderDiscount.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Discounts",
          key: "id",
        },
      },
      applied_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      discount_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderDiscount",
      tableName: "OrderDiscounts",
      timestamps: true,
    }
  );

  return OrderDiscount;
};
