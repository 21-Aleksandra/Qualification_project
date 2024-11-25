"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Address",
      [
        {
          country: "Estonia",
          city: "Tallinn",
          street: "Pärnu mnt, 67",
        },
        {
          country: "Estonia",
          city: "Tartu",
          street: "Jaama tn, 5",
        },
        {
          country: "Latvia",
          city: "Riga",
          street: "Brīvības iela 115",
        },
        {
          country: "Latvia",
          city: "Jurmala",
          street: "Jomas iela, 25",
        },
        {
          country: "Lithuania",
          city: "Vilnius",
          street: "Gedimino pr, 22",
        },
        {
          country: "Lithuania",
          city: "Kaunas",
          street: "Maironio gatvė 9",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Address", null, {});
  },
};
