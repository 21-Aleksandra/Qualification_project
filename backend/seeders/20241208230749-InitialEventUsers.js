"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Event_User", [
      {
        userId: 1,
        eventId: 1,
      },
      {
        userId: 4,
        eventId: 1,
      },
      {
        userId: 1,
        eventId: 3,
      },
      {
        userId: 1,
        eventId: 4,
      },
      {
        userId: 4,
        eventId: 4,
      },
      {
        userId: 4,
        eventId: 5,
      },
      {
        userId: 4,
        eventId: 6,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Event_User", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE event_user AUTO_INCREMENT = 1;"
    );
  },
};
