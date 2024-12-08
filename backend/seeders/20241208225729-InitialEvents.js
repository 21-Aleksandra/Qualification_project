"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Event", [
      {
        name: "Community Park Cleanup",
        description:
          "A volunteer event focused on cleaning and beautifying the local park.",
        typeId: 1,
        dateFrom: "2024-02-15 09:00:00",
        dateTo: "2024-02-15 15:00:00",
        publishOn: "2024-01-10 12:00:00",
        applicationDeadline: "2024-02-01 23:59:59",
        addressId: 3,
        subsidiaryId: 1,
        authorId: 2,
        maxPeopleAllowed: 50,
        photoSetId: 8,
      },
      {
        name: "Soup Kitchen Helpers",
        description:
          "Volunteers needed to prepare and serve meals for the community.",
        typeId: 2,
        dateFrom: "2023-12-20 08:00:00",
        dateTo: "2023-12-20 14:00:00",
        publishOn: "2023-11-15 10:00:00",
        applicationDeadline: "2023-12-10 23:59:59",
        addressId: 4,
        subsidiaryId: 2,
        authorId: 2,
        maxPeopleAllowed: 30,
        photoSetId: 9,
      },
      {
        name: "After-School Tutoring",
        description:
          "Help students improve their math and science skills after school.",
        typeId: 3,
        dateFrom: "2024-03-10 15:00:00",
        dateTo: "2024-03-10 18:00:00",
        publishOn: "2024-02-01 08:00:00",
        applicationDeadline: "2024-03-01 23:59:59",
        addressId: 3,
        subsidiaryId: 3,
        authorId: 2,
        maxPeopleAllowed: 20,
        photoSetId: 10,
      },
      {
        name: "Adopt-a-Pet Workshop",
        description: "A workshop to connect pets with loving families.",
        typeId: 4,
        dateFrom: "2023-11-25 10:00:00",
        dateTo: "2023-11-25 13:00:00",
        publishOn: "2023-10-20 10:00:00",
        applicationDeadline: "2023-11-20 23:59:59",
        addressId: 4,
        subsidiaryId: 4,
        authorId: 3,
        maxPeopleAllowed: 40,
        photoSetId: 11,
      },
      {
        name: "Winter Aid Distribution",
        description: "Providing winter supplies to those in need.",
        typeId: 5,
        dateFrom: "2024-01-05 09:00:00",
        dateTo: "2024-01-05 17:00:00",
        publishOn: "2023-12-01 09:00:00",
        applicationDeadline: "2023-12-20 23:59:59",
        addressId: 5,
        subsidiaryId: 5,
        authorId: 3,
        maxPeopleAllowed: 100,
        photoSetId: 12,
      },
      {
        name: "Urban Gardening Day",
        description:
          "Teach participants about urban gardening while helping the environment.",
        typeId: 1,
        dateFrom: "2024-04-15 08:00:00",
        dateTo: "2024-04-15 12:00:00",
        publishOn: "2024-03-01 09:00:00",
        applicationDeadline: "2024-04-10 23:59:59",
        addressId: 6,
        subsidiaryId: 7,
        authorId: 3,
        maxPeopleAllowed: 25,
        photoSetId: 13,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Event", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE event AUTO_INCREMENT = 1;"
    );
  },
};
