'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('User', [
      {
        username: 'luna_stardust',
        email: 'luna.stardust@cosmicmail.com',
        password: await bcrypt.hash('Starlight123!', 10), 
        role: 1,
      },
      {
        username: 'Maria Woods',
        email: 'nova.blaze@mail.com',
        password: await bcrypt.hash('Blaze_fire789', 10), 
        role: 2,
      },
      {
        username: 'James Karol',
        email: 'zephyr.horizon@gmail.com',
        password: await bcrypt.hash('Wind_rider456', 10), 
        role: 2,
      },
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('John_doe2024', 10),
        role: 1,
      },
      {
        username: 'admin',
        email: 'admin@adminmail.com',
        password: await bcrypt.hash('Rootpass24!', 10), 
        role: 3,
      }
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
