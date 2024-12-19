"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE Subsidiary SET newsSetId = 1 WHERE id = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE Subsidiary SET newsSetId = 3 WHERE id = 2;`
    );
    await queryInterface.sequelize.query(
      `UPDATE Subsidiary SET newsSetId = 5 WHERE id = 3;`
    );
    await queryInterface.sequelize.query(
      `UPDATE Subsidiary SET newsSetId = 7 WHERE id = 4;`
    );

    await queryInterface.sequelize.query(
      `UPDATE Event SET newsSetId = 8 WHERE id = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE Event SET newsSetId = 10 WHERE id = 2;`
    );
    await queryInterface.sequelize.query(
      `UPDATE Event SET newsSetId = 12 WHERE id = 3;`
    );
    await queryInterface.sequelize.query(
      `UPDATE Event SET newsSetId = 9 WHERE id = 4;`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE Subsidiary SET newsSetId = NULL WHERE id IN (1, 2, 3, 4);`
    );
    await queryInterface.sequelize.query(
      `UPDATE Event SET newsSetId = NULL WHERE id IN (1, 2, 3, 4);`
    );
  },
};
