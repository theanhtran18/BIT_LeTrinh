'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Tạo bảng Feedbacks
    await queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      service_type: {
        type: Sequelize.ENUM('Thái Độ', 'Sản Phẩm', 'Giá Cả', 'Khác'),
        allowNull: false,
      },
      rating: {
        type: Sequelize.ENUM('Quá tệ', 'Chưa tốt', 'Bình thường', 'Ổn', 'Quá tuyệt vời'),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    // Xóa bảng Feedbacks
    await queryInterface.dropTable('Feedbacks');
  }
};