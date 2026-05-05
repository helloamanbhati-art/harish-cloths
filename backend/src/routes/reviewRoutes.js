const express = require("express");
const reviewController = require("../controllers/reviewController");
const { authenticateCustomer } = require("../middleware/auth");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Create review
router.post("/", authenticateCustomer, apiLimiter, reviewController.createReview);

// Get product reviews (public)
router.get("/product/:productId", reviewController.getProductReviews);

// Update review
router.put("/:reviewId", authenticateCustomer, reviewController.updateReview);

// Delete review
router.delete("/:reviewId", authenticateCustomer, reviewController.deleteReview);

// Mark helpful/unhelpful
router.post("/:reviewId/helpful", reviewController.markHelpful);
router.post("/:reviewId/unhelpful", reviewController.markUnhelpful);

// Get customer reviews
router.get("/customer/reviews", authenticateCustomer, reviewController.getCustomerReviews);

module.exports = router;
