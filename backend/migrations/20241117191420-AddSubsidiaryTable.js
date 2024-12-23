"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subsidiary", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      mainOrganizationId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: Sequelize.DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      foundedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      addressId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      photoSetId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      newsSetId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      commentSetId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      staffCount: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addConstraint("Subsidiary", {
      fields: ["addressId"],
      type: "foreign key",
      name: "fk_subsidiary_address",
      references: {
        table: "Address",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Subsidiary", {
      fields: ["photoSetId"],
      type: "foreign key",
      name: "fk_subsidiary_photoSet",
      references: {
        table: "Photo_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Subsidiary", {
      fields: ["mainOrganizationId"],
      type: "foreign key",
      name: "fk_subsidiary_mainOrganisation",
      references: {
        table: "Main_Organization",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Subsidiary",
      "fk_subsidiary_address"
    );
    await queryInterface.removeConstraint(
      "Subsidiary",
      "fk_subsidiary_photoSet"
    );
    await queryInterface.removeConstraint(
      "Subsidiary",
      "fk_subsidiary_mainOrganisation"
    );
    await queryInterface.dropTable("Subsidiary");
  },
};
