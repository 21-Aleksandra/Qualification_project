const AppError = require("../utils/errorClass");
const logger = require("../utils/logger");

/**
 * Error handling middleware for catching both known and unknown errors.
 *
 * If the error is an instance of AppError(handeled,known error case), it responds with the appropriate
 * status code and message. Otherwise, it logs the details of the unknown error
 * and returns a generic error message to the client.
 *
 * @function errorHandler
 * @param {Object} err - The error object, which can be an instance of AppError or any other error.
 * @param {Object} req - The Express request object, containing details about the HTTP request.
 * @param {Object} res - The Express response object, used to send the error response.
 * @param {Function} next - The next middleware function in the request-response cycle (not used here).
 *
 * @returns {Object} - The error response sent to the client (a JSON object with error message).
 */
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

  // Return a generic error message for unknown errors to avoid leaking sensitive info
  return res
    .status(500)
    .json({ message: "An unknown error occurred. Please try again later." });
};
