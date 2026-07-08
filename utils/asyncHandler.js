/**
 * Wraps an async route/controller function and forwards any rejected
 * promise (thrown error) to Express's next(), so we never need
 * try/catch blocks inside controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
