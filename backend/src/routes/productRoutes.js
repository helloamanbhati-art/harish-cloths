const express = require("express");
const productController = require("../controllers/productController");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Get all products
router.get("/", apiLimiter, productController.getProducts);

// Search products
router.get("/search", apiLimiter, productController.searchProducts);

// Featured products
router.get("/featured", productController.getFeaturedProducts);

// Related products
router.get("/:id/related", productController.getRelatedProducts);

// Get product reviews
router.get("/:id/reviews", productController.getProductReviews);

// Get product by ID
router.get("/:id", productController.getProductById);

// By category
router.get("/category/:categoryId", productController.getProductsByCategory);

// By brand
router.get("/brand/:brandId", productController.getProductsByBrand);

// Get brands and categories
router.get("/api/brands", () => {});
router.get("/api/categories", () => {});

module.exports = router;
