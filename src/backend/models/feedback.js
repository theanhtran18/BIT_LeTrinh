const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Feedback extends Model {
    static associate(models) {
      // Một-nhiều với Customer
      Feedback.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
      });
    }
  }

  Feedback.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
      },
      service_type: {
        type: DataTypes.ENUM('Thái Độ', 'Sản Phẩm', 'Giá Cả', 'Khác'), // Enum cho loại dịch vụ
        allowNull: false,
      },
      rating: {
        type: DataTypes.ENUM('Quá tệ', 'Chưa tốt', 'Bình thường', 'Ổn', 'Quá tuyệt vời'), // Enum cho rating
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false, 
      },customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Feedback",
      tableName: "Feedbacks",
      timestamps: true,
    }
  );

  return Feedback;
};