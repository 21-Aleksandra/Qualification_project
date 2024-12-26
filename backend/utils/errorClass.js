/**
 * Custom error class to handle application-specific errors in a structured way.
 *
 * This class extends the native JavaScript Error class, allowing for the creation
 * of custom errors with specific status codes and providing a way to easily
 * handle different types of errors in the application.
 */

class AppError extends Error {
  /**
   * Creates an instance of the AppError class.
   *
   * @param {string} message - The error message to be shown.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Creates a Bad Request error (HTTP 400).
   *
   * @param {string} [message="Bad request"] - The error message for the Bad Request.
   * @returns {AppError} - The created AppError instance with a 400 status code.
   */
  static badRequest(message = "Bad request") {
    return new AppError(message, 400);
  }

  /**
   * Creates an Unauthorized error (HTTP 401).
   *
   * @param {string} [message="Unauthorized access"] - The error message for unauthorized access.
   * @returns {AppError} - The created AppError instance with a 401 status code.
   */
  static unauthorized(message = "Unauthorized access") {
    return new AppError(message, 401);
  }

  /**
   * Creates a Forbidden error (HTTP 403).
   *
   * @param {string} [message="Forbidden"] - The error message for forbidden access.
   * @returns {AppError} - The created AppError instance with a 403 status code.
   */
  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }

  /**
   * Creates a Not Found error (HTTP 404).
   *
   * @param {string} [message="Resource not found"] - The error message for resource not found.
   * @returns {AppError} - The created AppError instance with a 404 status code.
   */
  static notFound(message = "Resource not found") {
    return new AppError(message, 404);
  }

  /**
   * Creates an Internal Server Error (HTTP 500).
   *
   * @param {string} [message="Internal server error"] - The error message for internal server errors.
   * @returns {AppError} - The created AppError instance with a 500 status code.
   */
  static internalError(message = "Internal server error") {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
