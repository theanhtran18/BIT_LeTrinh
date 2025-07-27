const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class DiscountCondition extends Model {
    static associate(models) {
      DiscountCondition.belongsTo(models.Discount, {
        foreignKey: "discount_id",
        as: "discount",
      });
    }
  }

  DiscountCondition.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Discounts",
          key: "id",
        },
      },
      conditionType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 20],
        },
      },
      value: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DiscountCondition",
      tableName: "DiscountConditions",
      timestamps: true,
    }
  );

  return DiscountCondition;
};
