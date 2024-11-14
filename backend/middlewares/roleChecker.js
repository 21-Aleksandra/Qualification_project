const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");

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
