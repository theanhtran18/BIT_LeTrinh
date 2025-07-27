"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CustomerAdmins", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Admins",
          key: "id",
        },
      },
      customer_id: {
        type: Sequelize.STRING,
        references: {
          model: "Customers",
          key: "id",
        },
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
    await queryInterface.dropTable("CustomerAdmins");
  },
};
