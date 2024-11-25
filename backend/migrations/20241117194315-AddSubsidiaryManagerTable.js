"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subsidiary_Manager", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      managerId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      subsidiaryId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
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

    await queryInterface.addConstraint("Subsidiary_Manager", {
      fields: ["managerId"],
      type: "foreign key",
      name: "fk_subsidiaryManager_user",
      references: {
        table: "User",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Subsidiary_Manager", {
      fields: ["subsidiaryId"],
      type: "foreign key",
      name: "fk_subsidiaryManager_subsidiary",
      references: {
        table: "Subsidiary",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Subsidiary_Manager",
      "fk_subsidiaryManager_user"
    );
    await queryInterface.removeConstraint(
      "Subsidiary_Manager",
      "fk_subsidiaryManager_subsidiary"
    );

    await queryInterface.dropTable("Subsidiary_Manager");
  },
};
