"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Subsidiary_Mission",
      [
        {
          missionId: 1,
          subsidiaryId: 1,
        },
        {
          missionId: 2,
          subsidiaryId: 2,
        },
        {
          missionId: 6,
          subsidiaryId: 2,
        },
        {
          missionId: 3,
          subsidiaryId: 3,
        },
        {
          missionId: 4,
          subsidiaryId: 4,
        },
        {
          missionId: 5,
          subsidiaryId: 5,
        },
        {
          missionId: 6,
          subsidiaryId: 5,
        },
        {
          missionId: 7,
          subsidiaryId: 6,
        },
        {
          missionId: 6,
          subsidiaryId: 7,
        },
        {
          missionId: 1,
          subsidiaryId: 7,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Subsidiary_Mission", null, {});
  },
};
