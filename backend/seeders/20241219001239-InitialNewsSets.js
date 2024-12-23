"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const newsSets = Array.from({ length: 14 }, () => ({
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("News_Set", newsSets, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("News_Set", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE News_Set AUTO_INCREMENT = 1;"
    );
  },
};
