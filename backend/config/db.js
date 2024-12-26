/* 
   This file is meant for initializing a Sequelize instance
   for managing database connections.
   
   Includes options like disabling logging and enforcing 
   consistent table naming conventions.
*/

const { Sequelize } = require("sequelize");
const config = require("./config");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: false,
    timezone: dbConfig.timezone,
    define: {
      underscored: true, // Allows snake_case for column names
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
    },
  }
);

module.exports = sequelize;
