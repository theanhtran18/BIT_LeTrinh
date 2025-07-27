"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Admins", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      app_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roles: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.STRING,
        allowNull: true,
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

    await queryInterface.addIndex("Admins", ["app_id", "customer_id"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Admins", ["app_id", "customer_id"]);

    await queryInterface.dropTable("Admins");
  },
};
