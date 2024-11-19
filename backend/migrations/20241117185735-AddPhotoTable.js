"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Photo", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      filename: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: true,
      },
      photoSetId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      isBannerPhoto: {
        type: Sequelize.DataTypes.BOOLEAN,
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

    await queryInterface.addConstraint("Photo", {
      fields: ["photoSetId"],
      type: "foreign key",
      name: "fk_photo_photoSet",
      references: {
        table: "Photo_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Photo", "fk_photo_photoSet");
    await queryInterface.dropTable("Photo");
  },
};
