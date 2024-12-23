"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const commentSets = Array.from({ length: 21 }, () => ({
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Comment_Set", commentSets, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Comment_Set", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE Comment_Set AUTO_INCREMENT = 1;"
    );
  },
};
