"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate("User", { photoId: 6 }, { id: 1 });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate("User", { photoId: null }, { id: 1 });
  },
};
