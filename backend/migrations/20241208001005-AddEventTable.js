"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Event", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      typeId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      dateFrom: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      dateTo: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      publishOn: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      applicationDeadline: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      addressId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      subsidiaryId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      maxPeopleAllowed: {
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

    await queryInterface.addConstraint("Event", {
      fields: ["typeId"],
      type: "foreign key",
      name: "fk_event_event_type",
      references: {
        table: "Event_Type",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Event", {
      fields: ["addressId"],
      type: "foreign key",
      name: "fk_event_address",
      references: {
        table: "Address",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Event", {
      fields: ["subsidiaryId"],
      type: "foreign key",
      name: "fk_event_subsidiary",
      references: {
        table: "Subsidiary",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Event", {
      fields: ["authorId"],
      type: "foreign key",
      name: "fk_event_user",
      references: {
        table: "User",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Event", {
      fields: ["photoSetId"],
      type: "foreign key",
      name: "fk_event_photoSet",
      references: {
        table: "Photo_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Event");
  },
};
