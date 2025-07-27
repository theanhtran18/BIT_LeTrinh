const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class CustomerAdmin extends Model {
    static associate(models) {
      CustomerAdmin.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
      CustomerAdmin.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
      });
    }
  }

  CustomerAdmin.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      admin_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Admins",
          key: "id",
        },
      },
      customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Customers",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "CustomerAdmin",
      tableName: "CustomerAdmins",
      timestamps: true
    }
  );

  return CustomerAdmin;
};
