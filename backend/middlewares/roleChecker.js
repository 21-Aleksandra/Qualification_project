const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");

/**
 * Middleware to check if a user has the required roles to access a specific endpoint.
 *
 * This function verifies that the user has a valid session, checks their roles,
 * and compares them with the required roles for the endpoint. It responds with
 * a forbidden error if the user lacks the necessary role or if their account is blocked,
 * otherwise it allows the access to the next instances
 *
 * @function roleChecker
 * @param {Array} requiredRoles - An array of roles that are required to access the endpoint.
 * @returns {Function} A middleware function that checks if the user has the required role(s).
 * @throws {AppError} Throws a forbidden error if the user doesn't have the required role or if blocked.
 * @throws {AppError} Throws an unauthorized error if the user is not logged in or has no roles.
 */
const roleChecker = (requiredRoles) => {
  return (req, res, next) => {
    if (
      req.session &&
      req.session.user &&
      req.session.user.roles !== undefined
    ) {
      const userRoles = req.session.user.roles;

      if (userRoles.includes(Roles.BLOCKED)) {
        return next(
          AppError.forbidden("Your account is blocked. Please contact support.")
        );
      }
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (hasRequiredRole) {
        return next();
      } else {
        return next(
          AppError.forbidden(
            "You do not have permission to access this resource."
          )
        );
      }
    } else {
      return next(
        AppError.unauthorized("Please log in to access this resource.")
      );
    }
  };
};

module.exports = roleChecker;
