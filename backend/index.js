require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const sequelize = require("./config/db");
const router = require("./routes/index");
const bodyParser = require("body-parser");
const errorHandlerMiddleware = require("./middlewares/errorHandler.js");
const { createClient } = require("redis");
const RedisStore = require("connect-redis").default;
const redisClient = createClient();

redisClient
  .connect()
  .catch((e) => console.log("Could not connect to Redis", e));

const PORT = process.env.PORT;

const my_app = express();

my_app.use(express.urlencoded({ extended: true }));
my_app.use(cors());
my_app.use(express.json());

my_app.use(
  session({
    key: "sessionId",
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({
      client: redisClient,
      ttl: process.env.SESSION_TTL,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

my_app.use("/api", router);

my_app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    my_app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
