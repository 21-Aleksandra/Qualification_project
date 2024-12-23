"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`newsSetId\` = 1 WHERE \`id\` = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`newsSetId\` = 2 WHERE \`id\` = 2;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`newsSetId\` = 3 WHERE \`id\` = 3;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`newsSetId\` = 4 WHERE \`id\` = 4;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`newsSetId\` = 5 WHERE \`id\` = 5;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`newsSetId\` = 6 WHERE \`id\` = 6;`
    );

    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = 7 WHERE \`id\` = 1;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = 8 WHERE \`id\` = 2;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = 9 WHERE \`id\` = 3;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = 10 WHERE \`id\` = 4;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = 11 WHERE \`id\` = 5;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = 12 WHERE \`id\` = 6;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = 13 WHERE \`id\` = 7;`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE \`Event\` SET \`newsSetId\` = NULL;`
    );
    await queryInterface.sequelize.query(
      `UPDATE \`Subsidiary\` SET \`newsSetId\` = NULL;`
    );
  },
};
