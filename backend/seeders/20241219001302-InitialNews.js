"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "News",
      [
        // News for subsidiaries (newsSetId: 1 to 7)
        {
          title: "Exciting New Partnership",
          authorId: 2,
          content:
            "We are thrilled to announce a new partnership with XYZ Corp. Stay tuned for more updates!",
          newsSetId: 1,
        },
        {
          title: "Volunteer Program Expansion",
          authorId: 3,
          content:
            "Our subsidiary is expanding its volunteer programs to reach more communities. Join us!",
          newsSetId: 3,
        },
        {
          title: "Achievements of the Year",
          authorId: 2,
          content:
            "Here are the highlights of our subsidiary's achievements for the past year. We are proud!",
          newsSetId: 5,
        },
        {
          title: "Join Our Training Sessions",
          authorId: 3,
          content:
            "Our subsidiary is hosting training sessions for new volunteers. Don't miss it!",
          newsSetId: 7,
        },

        // News for events (newsSetId: 8 to 14)
        {
          title: "Upcoming Volunteer Meetup",
          authorId: 2,
          content:
            "Join us for a volunteer meetup this weekend. Network and learn from fellow volunteers.",
          newsSetId: 8,
        },
        {
          title: "Charity Walk Success",
          authorId: 3,
          content:
            "Our recent charity walk event was a huge success, raising funds for a great cause. Thank you!",
          newsSetId: 10,
        },
        {
          title: "Volunteer Day Celebration",
          authorId: 2,
          content:
            "Celebrate Volunteer Day with us at our special event. There will be activities and prizes!",
          newsSetId: 12,
        },
        {
          title: "Annual Gala Announcement",
          authorId: 3,
          content:
            "Save the date! Our annual gala event is coming up. More details to follow soon.",
          newsSetId: 9,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("News", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE News AUTO_INCREMENT = 1;"
    );
  },
};
