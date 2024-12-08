"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Event_Type", [
      {
        name: "Neighborhood cleanup",
      },
      {
        name: "Kitchen volunteering",
      },
      {
        name: "Youth tutoring sessions",
      },
      {
        name: "Pet adoption workshop",
      },
      {
        name: "Emergency aid distribution",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Event_Type", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE event_type AUTO_INCREMENT = 1;"
    );
  },
};
