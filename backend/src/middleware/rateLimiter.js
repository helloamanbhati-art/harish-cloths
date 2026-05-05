const rateLimit = require("express-rate-limit");

// General rate limiter
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes.",
  skipSuccessfulRequests: true, // don't count successful requests
});

// API routes limiter
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute (increased for admin panel)
  message: "Too many API requests from this IP, please try again later.",
});

// Upload limiter
exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 uploads per hour
  message: "Too many uploads from this IP, please try again later.",
});
