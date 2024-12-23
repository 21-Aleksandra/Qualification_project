"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Subsidiary", {
      fields: ["commentSetId"],
      type: "foreign key",
      name: "fk_subsidiary_comment_set",
      references: {
        table: "Comment_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Event", {
      fields: ["commentSetId"],
      type: "foreign key",
      name: "fk_event_comment_set",
      references: {
        table: "Comment_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("News", {
      fields: ["commentSetId"],
      type: "foreign key",
      name: "fk_news_comment_set",
      references: {
        table: "Comment_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Subsidiary",
      "fk_subsidiary_comment_set"
    );

    await queryInterface.removeConstraint("Event", "fk_event_comment_set");

    await queryInterface.removeConstraint("News", "fk_news_comment_set");
  },
};
