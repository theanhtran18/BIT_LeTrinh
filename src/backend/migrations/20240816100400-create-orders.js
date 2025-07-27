"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.STRING,
        references: {
          model: "Customers",
          key: "id",
        },
      },
      shipping_address: {
        type: Sequelize.TEXT,
      },
      shipping_fee: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      note: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
