const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");

const roleChecker = (requiredRoles) => {
  return (req, res, next) => {
    if (
      req.session &&
      req.session.user &&
      req.session.user.role !== undefined
    ) {
      const userRole = req.session.user.role;

      if (userRole === Roles.BLOCKED) {
        return next(
          AppError.forbidden("Your account is blocked. Please contact support.")
        );
      }

      if (requiredRoles.includes(userRole)) {
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
