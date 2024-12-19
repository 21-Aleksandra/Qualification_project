const AppError = require("../utils/errorClass");
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  const timestamp = new Date().toISOString();

  logger.error("Unknown error occurred:", {
    timestamp: timestamp,
    message: err.message,
    stack: err.stack,
    name: err.name,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    headers: req.headers,
  });

  return res
    .status(500)
    .json({ message: "An unknown error occurred. Please try again later." });
};
