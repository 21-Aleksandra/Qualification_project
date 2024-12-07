"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Address", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      country: {
        type: Sequelize.DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      city: {
        type: Sequelize.DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      street: {
        type: Sequelize.DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      lat: {
        type: Sequelize.DataTypes.DECIMAL(14, 10),
        allowNull: true,
      },
      lng: {
        type: Sequelize.DataTypes.DECIMAL(14, 10),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
        onUpdate: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Address");
  },
};
