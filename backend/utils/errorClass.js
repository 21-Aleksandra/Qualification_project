class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new AppError(message, 400);
  }

  static unauthorized(message = "Unauthorized access") {
    return new AppError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, 404);
  }

  static internalError(message = "Internal server error") {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
