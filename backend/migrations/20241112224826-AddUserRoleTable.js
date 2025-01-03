"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User_Role", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      roleId: {
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

    await queryInterface.addConstraint("User_Role", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_userRole_user",
      references: {
        table: "User",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("User_Role", {
      fields: ["roleId"],
      type: "foreign key",
      name: "fk_userRole_role",
      references: {
        table: "Role",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("User_Role", "fk_userRole_user");
    await queryInterface.removeConstraint("User_Role", "fk_userRole_role");
    await queryInterface.dropTable("User_Role");
  },
};
