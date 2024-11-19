"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Main_Organization",
      [
        {
          name: "Latvian Volunteer Network",
        },
        {
          name: "Eesti Vabatahtlikud",
        },
        {
          name: "Lietuvos Savanoriai",
        },
        {
          name: "Global Volunteers Alliance",
        },
        {
          name: "Latvijas brīvpratīgo centrs (LBC)",
        },
        {
          name: "Ühiskondlik Abistamine",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Main_Organization", null, {});
  },
};
