"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Subsidiary_Manager",
      [
        {
          managerId: 2,
          subsidiaryId: 1,
        },
        {
          managerId: 2,
          subsidiaryId: 2,
        },
        {
          managerId: 2,
          subsidiaryId: 3,
        },
        {
          managerId: 3,
          subsidiaryId: 4,
        },
        {
          managerId: 3,
          subsidiaryId: 5,
        },
        {
          managerId: 3,
          subsidiaryId: 6,
        },
        {
          managerId: 2,
          subsidiaryId: 7,
        },
        {
          managerId: 3,
          subsidiaryId: 7,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Subsidiary_Manager", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE subsidiary_manager AUTO_INCREMENT = 1;"
    );
  },
};
