"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ORGANIZATION_IMAGE_PATH = process.env.ORGANIZATION_IMAGE_PATH;
    const EVENT_IMAGE_PATH = process.env.EVENT_IMAGE_PATH;

    await queryInterface.bulkInsert(
      "Photo",
      [
        {
          url: `${ORGANIZATION_IMAGE_PATH}test_1_org.png`,
          filename: "test_1_org.png",
          type: "png",
          photoSetId: 1,
          isBannerPhoto: true,
        },
        {
          url: `${ORGANIZATION_IMAGE_PATH}test_2_org.png`,
          filename: "test_2_org.png",
          type: "png",
          photoSetId: 1,
          isBannerPhoto: false,
        },
        {
          url: `${ORGANIZATION_IMAGE_PATH}test_3_org.png`,
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
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Photo", null, {});
  },
};
