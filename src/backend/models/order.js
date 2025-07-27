const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsToMany(models.Product, {
        through: models.OrderProduct,
        foreignKey: "order_id",
        otherKey: "product_id", 
        as: "products",
      });

      Order.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
      });

      Order.belongsToMany(models.Discount, {
        through: models.OrderDiscount,
        foreignKey: "order_id",
        otherKey: "discount_id",
        as: "discounts",
      });

      Order.hasOne(models.Payment, {
        foreignKey: "order_id",
        as: "payment",
      });
    }
  }

  Order.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      customer_id: {
        type: DataTypes.STRING,
        references: {
          model: "Customers",
          key: "id",
        },
      },
      shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      shipping_fee: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      note: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
    }
  );

  return Order;
};
