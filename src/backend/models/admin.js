const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Admin extends Model {
    static associate(models) {
      // many to many relationship between Admin and Customer
      Admin.belongsToMany(models.Customer, {
        through: models.CustomerAdmin,
        foreignKey: "admin_id",
        as: "customers",
      });
    }
  }

  Admin.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      app_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Customers",
          key: "id",
        },
      },
      roles: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "Admins",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["app_id", "customer_id"],
        },
      ],
    }
  );

  return Admin;
};
