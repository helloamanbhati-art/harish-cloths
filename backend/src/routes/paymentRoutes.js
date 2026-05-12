const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticateCustomer, authenticateAdmin, optionalAuthenticate } = require("../middleware/auth");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Create payment order
router.post(
  "/create-order",
  authenticateCustomer,
  apiLimiter,
  paymentController.createPaymentOrder
);

// Verify payment
router.post(
  "/verify",
  optionalAuthenticate,
  apiLimiter,
  paymentController.verifyPayment
);

// Payment failure
router.post(
  "/failure",
  optionalAuthenticate,
  paymentController.handlePaymentFailure
);

// Request refund
router.post(
  "/refund-request",
  authenticateCustomer,
  paymentController.requestRefund
);

// Process refund (admin only)
router.post(
  "/:orderId/refund",
  authenticateAdmin,
  paymentController.processRefund
);

// Get transactions
router.get(
  "/:orderId/transactions",
  authenticateCustomer,
  paymentController.getTransactions
);

// Razorpay webhook
router.post("/webhook/razorpay", paymentController.handleRazorpayWebhook);

module.exports = router;
