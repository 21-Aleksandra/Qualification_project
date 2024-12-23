"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("News", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      newsSetId: {
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

    await queryInterface.addConstraint("News", {
      fields: ["newsSetId"],
      type: "foreign key",
      name: "fk_news_newsSet",
      references: {
        table: "News_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("News", {
      fields: ["authorId"],
      type: "foreign key",
      name: "fk_news_user",
      references: {
        table: "User",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("News", "fk_news_newsSet");
    await queryInterface.removeConstraint("News", "fk_news_user");
    await queryInterface.dropTable("News");
  },
};
