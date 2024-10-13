const AppError = require("../utils/errorClass");

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "An unknown error occurred" });
};
