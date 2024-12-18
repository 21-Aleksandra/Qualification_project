"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const SUBSIDIARY_IMAGE_PATH = process.env.SUBSIDIARY_IMAGE_PATH;
    const EVENT_IMAGE_PATH = process.env.EVENT_IMAGE_PATH;
    const USER_IMAGE_PATH = process.env.USER_IMAGE_PATH;

    await queryInterface.bulkInsert(
      "Photo",
      [
        {
          url: `${SUBSIDIARY_IMAGE_PATH}test_1_org.png`,
          filename: "test_1_org.png",
          type: "png",
          photoSetId: 1,
          isBannerPhoto: true,
        },
        {
          url: `${SUBSIDIARY_IMAGE_PATH}test_2_org.png`,
          filename: "test_2_org.png",
          type: "png",
          photoSetId: 1,
          isBannerPhoto: false,
        },
        {
          url: `${SUBSIDIARY_IMAGE_PATH}test_3_org.png`,
          filename: "test_3_org.png",
          type: "png",
          photoSetId: 1,
          isBannerPhoto: false,
        },
        {
          url: `${EVENT_IMAGE_PATH}test_1_event.png`,
          filename: "test_1_event.png",
          type: "png",
          photoSetId: 8,
          isBannerPhoto: true,
        },
        {
          url: `${EVENT_IMAGE_PATH}test_2_event.png`,
          filename: "test_2_event.png",
          type: "png",
          photoSetId: 8,
          isBannerPhoto: false,
        },
        {
          url: `${USER_IMAGE_PATH}test_1_user.png`,
          filename: "test_1_user.png",
          type: "png",
          photoSetId: null,
          isBannerPhoto: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Photo", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE photo AUTO_INCREMENT = 1;"
    );
  },
};
