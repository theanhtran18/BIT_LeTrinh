"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Variants", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM("multiple", "single"),
        allowNull: false,
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
    await queryInterface.dropTable("Variants");
  },
};
