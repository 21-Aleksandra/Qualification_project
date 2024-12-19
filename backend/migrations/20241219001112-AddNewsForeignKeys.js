/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Subsidiary", {
      fields: ["newsSetId"],
      type: "foreign key",
      name: "fk_subsidiary_news_set",
      references: {
        table: "News_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Event", {
      fields: ["newsSetId"],
      type: "foreign key",
      name: "fk_event_news_set",
      references: {
        table: "News_Set",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Subsidiary",
      "fk_subsidiary_news_set"
    );

    await queryInterface.removeConstraint("Event", "fk_event_news_set");
  },
};
