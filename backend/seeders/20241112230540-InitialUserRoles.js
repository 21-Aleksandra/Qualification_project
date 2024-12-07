"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("User_Role", [
      {
        userId: 1,
        roleId: 1,
      },
      {
        userId: 2,
        roleId: 2,
      },
      {
        userId: 3,
        roleId: 2,
      },
      {
        userId: 4,
        roleId: 1,
      },
      {
        userId: 5,
        roleId: 3,
      },
      {
        userId: 6,
        roleId: 2,
      },
      {
        userId: 6,
        roleId: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User_Role", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE user_role AUTO_INCREMENT = 1;"
    );
  },
};
