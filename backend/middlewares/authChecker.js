const AppError = require("../utils/errorClass");

const authChecker = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return next(AppError.unauthorized());
  }
};

module.exports = authChecker;
