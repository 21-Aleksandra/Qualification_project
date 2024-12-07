"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Photo_Set",
      [
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Photo_Set", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE photo_set AUTO_INCREMENT = 1;"
    );
  },
};
