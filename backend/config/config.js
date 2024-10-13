require('dotenv').config(); 

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAMING,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT, 
    port: process.env.DB_PORT,
    timezone: process.env.TIMEZONE,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAMING,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT, 
    port: process.env.DB_PORT,
    timezone: process.env.TIMEZONE,
  },
};