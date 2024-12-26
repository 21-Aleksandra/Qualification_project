"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // To avoid code repetition and creating autonumurated photo_sets
    const photoSets = Array.from({ length: 14 }, () => ({
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Photo_Set", photoSets, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Photo_Set", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE Photo_Set AUTO_INCREMENT = 1;"
    );
  },
};
