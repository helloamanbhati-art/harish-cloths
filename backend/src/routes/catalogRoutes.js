const express = require("express");
const productController = require("../controllers/productController");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Get brands
router.get("/", apiLimiter, productController.getBrands);

// Get categories
router.get("/categories", apiLimiter, productController.getCategories);

module.exports = router;
