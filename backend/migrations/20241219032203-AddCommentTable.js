"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comment", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      text: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      commentSetId: {
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

    await queryInterface.addConstraint("Comment", {
      fields: ["authorId"],
      type: "foreign key",
      name: "fk_comment_user",
      references: {
        table: "User",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Comment", {
      fields: ["commentSetId"],
      type: "foreign key",
      name: "fk_comment_commentSet",
      references: {
        table: "Comment_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Comment", "fk_comment_user");
    await queryInterface.removeConstraint("Comment", "fk_comment_commentSet");
    await queryInterface.dropTable("Comment");
  },
};
