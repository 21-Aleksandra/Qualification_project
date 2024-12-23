"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`commentSetId\` = 1 WHERE \`id\` = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`commentSetId\` = 2 WHERE \`id\` = 2;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`commentSetId\` = 3 WHERE \`id\` = 3;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`commentSetId\` = 4 WHERE \`id\` = 4;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`commentSetId\` = 5 WHERE \`id\` = 5;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`commentSetId\` = 6 WHERE \`id\` = 6;`
    );

    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = 7 WHERE \`id\` = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = 8 WHERE \`id\` = 2;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = 9 WHERE \`id\` = 3;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = 10 WHERE \`id\` = 4;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = 11 WHERE \`id\` = 5;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = 12 WHERE \`id\` = 6;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = 13 WHERE \`id\` = 7;`
    );

    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 14 WHERE \`id\` = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 15 WHERE \`id\` = 2;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 16 WHERE \`id\` = 3;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 17 WHERE \`id\` = 4;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 18 WHERE \`id\` = 5;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 19 WHERE \`id\` = 6;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 20 WHERE \`id\` = 7;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = 21 WHERE \`id\` = 8;`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`commentSetId\` = NULL;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`commentSetId\` = NULL;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`News\` SET \`commentSetId\` = NULL;`
    );
  },
};
