require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


// Middleware
const { requestLogger } = require("./middleware/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Models - Import from separate files
const AdminUser = require("./models/AdminUser");
const Customer = require("./models/Customer");
const Product = require("./models/Product");
const Brand = require("./models/Brand");
const Category = require("./models/Category");
const Order = require("./models/Order");
const Review = require("./models/Review");
const Inventory = require("./models/Inventory");

const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing request bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/catalog", catalogRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

/**
 * Ensure default admin user exists
 * Creates one if it doesn't exist using environment variables
 */
async function ensureDefaultAdmin() {
  try {
    const email = (process.env.ADMIN_EMAIL || "admin@harishcloths.com").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      console.log(`✓ Admin user already exists: ${email}`);
      return;
    }

// NEW CODE — paste these 2 lines instead
await AdminUser.create({ firstName: "Admin", email, password });
  } catch (error) {
    console.error("Error ensuring default admin:", error.message);
    throw error;
  }
}

module.exports = { app, ensureDefaultAdmin };
