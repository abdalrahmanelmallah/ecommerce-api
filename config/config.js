/**
 * Central place for app-wide configuration values pulled from environment
 * variables. Keeping this separate from app.js keeps process.env access
 * in one place.
 */
module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
};
