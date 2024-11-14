"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "User",
      [
        {
          username: "Luna Stardust",
          email: "luna.stardust@cosmicmail.com",
          password: await bcrypt.hash("Starlight123!", 10),
          isVerified: true,
        },
        {
          username: "Maria Woods",
          email: "nova.blaze@mail.com",
          password: await bcrypt.hash("Blaze_fire789", 10),
          isVerified: true,
        },
        {
          username: "James Karol",
          email: "zephyr.horizon@gmail.com",
          password: await bcrypt.hash("Wind_rider456", 10),
          isVerified: true,
        },
        {
          username: "John Doe",
          email: "john.doe@example.com",
          password: await bcrypt.hash("John_doe2024", 10),
          isVerified: false,
        },
        {
          username: "Admin",
          email: "admin@adminmail.com",
          password: await bcrypt.hash("Rootpass24!", 10),
          isVerified: true,
        },
        {
          username: "test_multiple_roles",
          email: "testtest@test.com",
          password: await bcrypt.hash("TestTest", 10),
          isVerified: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("User", null, {});
  },
};
