"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VariantOptions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      priceChange: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      variant_id: {
        type: Sequelize.STRING,
        references: {
          model: "Variants",
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
    await queryInterface.dropTable("VariantOptions");
  },
};
