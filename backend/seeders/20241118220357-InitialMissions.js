"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Mission",
      [
        {
          name: "Promote environmental sustainability",
        },
        {
          name: "Help nature and people",
        },
        {
          name: "Support mental health awareness",
        },
        {
          name: "Combat hunger through food distribution",
        },
        {
          name: "Empower women through education",
        },
        {
          name: "Encourage community engagement",
        },
        {
          name: "Aid in global disaster relief",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Mission", null, {});
  },
};
