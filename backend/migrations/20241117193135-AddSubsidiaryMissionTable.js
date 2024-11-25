"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subsidiary_Mission", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      missionId: {
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

    await queryInterface.addConstraint("Subsidiary_Mission", {
      fields: ["missionId"],
      type: "foreign key",
      name: "fk_subsidiaryMission_mission",
      references: {
        table: "Mission",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Subsidiary_Mission", {
      fields: ["subsidiaryId"],
      type: "foreign key",
      name: "fk_subsidiaryMission_subsidiary",
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
      "Subsidiary_Mission",
      "fk_subsidiaryMission_mission"
    );
    await queryInterface.removeConstraint(
      "Subsidiary_Mission",
      "fk_subsidiaryMission_subsidiary"
    );

    await queryInterface.dropTable("Subsidiary_Mission");
  },
};
