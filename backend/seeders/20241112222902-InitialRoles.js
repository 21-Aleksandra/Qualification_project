"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Role",
      [
        {
          id: 0,
          rolename: "BLOCKED",
        },
        {
          id: 1,
          rolename: "REGULAR",
        },
        {
          id: 2,
          rolename: "MANAGER",
        },
        {
          id: 3,
          rolename: "ADMIN",
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Role", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE role AUTO_INCREMENT = 1;"
    );
  },
};
