"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("User", {
      fields: ["photoId"],
      type: "foreign key",
      name: "fk_user_photo",
      references: {
        table: "Photo",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("User", "fk_user_photo");
  },
};
