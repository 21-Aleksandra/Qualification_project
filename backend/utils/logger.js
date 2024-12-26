const winston = require("winston");
require("winston-daily-rotate-file");

/**
 * Custom log format that includes timestamp, log level, message, stack trace, and metadata.
 * This format is used for both console and file outputs to ensure uniform log formatting.
 *
 * @param {Object} param - The log parameters.
 * @param {string} param.timestamp - The timestamp when the log is created.
 * @param {string} param.level - The log level (e.g., 'error', 'info').
 * @param {string} param.message - The log message.
 * @param {string} param.stack - The stack trace, if available.
 * @param {Object} param.metadata - Additional metadata to include in the log.
 * @returns {string} - A formatted log string.
 */
const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack, ...metadata }) => {
    let meta = "";

    if (Object.keys(metadata).length) {
      meta = `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return `${timestamp} [${level}]: ${message} ${stack || ""}${meta}`;
  }
);

/**
 * Winston transport configuration for daily log file rotation.
 * The log files will rotate daily and be compressed, with a maximum size of 1GB per file.
 * Logs older than 14 days are automatically deleted.
 *
 * @type {winston.transports.DailyRotateFile}
 */
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "1g",
  maxFiles: "14d",
});

/**
 * Logger configuration using Winston with both daily rotating file and console transports.
 * The logger writes error-level logs to both the console and a file with rotation.
 *
 * @type {winston.Logger}
 */
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
