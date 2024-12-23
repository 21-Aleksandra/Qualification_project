"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Comment",
      [
        {
          authorId: 1,
          text: "Amazing event with fantastic visuals!",
          rating: 5,
          commentSetId: 1,
        },
        {
          authorId: 4,
          text: "Loved the event. Great moments captured!",
          rating: 4,
          commentSetId: 1,
        },
        {
          authorId: 1,
          text: "Text in the news article added so much depth to the story.",
          rating: 5,
          commentSetId: 14,
        },
        {
          authorId: 4,
          text: "Great accompanying details for the news. Perfectly chosen.",
          rating: 3,
          commentSetId: 15,
        },
        {
          authorId: 1,
          text: "The subsidiary photos captured the essence of the service perfectly.",
          rating: 5,
          commentSetId: 7,
        },
        {
          authorId: 4,
          text: "Good photos, but could use a bit more variety in the shots.",
          rating: 3,
          commentSetId: 8,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Comment", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE Comment AUTO_INCREMENT = 1;"
    );
  },
};
