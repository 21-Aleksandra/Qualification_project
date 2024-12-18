"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Request_Sequences",
      [
        {
          code: "adminRequest",
          number: 1,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Request_Sequences",
      { code: "adminRequest" },
      {}
    );
  },
};
