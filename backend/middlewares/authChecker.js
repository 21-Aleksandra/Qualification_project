const AppError = require("../utils/errorClass");

/**
 * Middleware to verify if a user is authenticated.
 *
 * This function checks for an active session and user data in the request object.
 * If authentication is verified, it passes control to the next middleware or route handler.
 * Otherwise, it generates an unauthorized error.
 *
 * @function authChecker
 * @param {Object} req - The Express request object, containing session data.
 * @param {Object} res - The Express response object (not used directly in this function).
 * @param {Function} next - Callback function to pass control to the next middleware.
 * @throws {AppError} Throws an unauthorized error if the session or user is missing.
 */
const authChecker = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return next(AppError.unauthorized());
  }
};

module.exports = authChecker;
