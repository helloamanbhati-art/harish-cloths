const express = require("express");
const authController = require("../controllers/authController");
const { authenticateCustomer } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Public routes
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/request-password-reset", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

// Protected routes
router.get("/profile", authenticateCustomer, authController.getProfile);
router.put("/profile", authenticateCustomer, authController.updateProfile);

// Addresses
router.post("/addresses", authenticateCustomer, authController.addAddress);
router.put("/addresses/:addressId", authenticateCustomer, authController.updateAddress);
router.delete("/addresses/:addressId", authenticateCustomer, authController.deleteAddress);

// Wishlist
router.post("/wishlist", authenticateCustomer, authController.addToWishlist);
router.delete("/wishlist/:productId", authenticateCustomer, authController.removeFromWishlist);
router.get("/wishlist", authenticateCustomer, authController.getWishlist);

module.exports = router;
