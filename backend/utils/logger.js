const winston = require("winston");
require("winston-daily-rotate-file");

const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack, ...metadata }) => {
    let meta = "";

    if (Object.keys(metadata).length) {
      meta = `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return `${timestamp} [${level}]: ${message} ${stack || ""}${meta}`;
  }
);

const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "1g",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    dailyRotateTransport,
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
