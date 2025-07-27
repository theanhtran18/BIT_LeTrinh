const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Customer extends Model {
    static associate(models) {
      // Một-nhiều với Order
      Customer.hasMany(models.Order, {
        foreignKey: "customer_id",
        as: "orders",
      });

      //  many to many relationship between Admin and Customer
      Customer.belongsToMany(models.Admin, {
        through: models.CustomerAdmin,
        foreignKey: "customer_id",
        as: "admins",
      });
    }
  }

  Customer.init(
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
      phone_number: {
        type: DataTypes.STRING,
        unique: true,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "Customers",
      timestamps: true,
    }
  );

  return Customer;
};
