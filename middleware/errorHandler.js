/**
 * Central error-handling middleware. Must be registered LAST, after all
 * routes and the 404 handler. Normalizes different error types
 * (Mongoose validation, cast errors, duplicate keys, and our own
 * AppError) into a single consistent { status, message, data } shape.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error (missing/invalid required fields)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose bad ObjectId (e.g. GET /api/products/123)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key error (e.g. duplicate unique field)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    status: "error",
    message,
    data: null,
  });
};

module.exports = errorHandler;
