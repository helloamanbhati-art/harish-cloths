const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticateCustomer, optionalAuthenticate } = require("../middleware/auth");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Create order (guest checkout allowed)
router.post("/", optionalAuthenticate, apiLimiter, orderController.createOrder);

// Get customer orders
router.get("/", authenticateCustomer, orderController.getCustomerOrders);

// Get order by ID
router.get("/:orderId", authenticateCustomer, orderController.getOrderById);

// Cancel order
router.post("/:orderId/cancel", authenticateCustomer, orderController.cancelOrder);

// Request return
router.post("/:orderId/return", authenticateCustomer, orderController.requestReturn);

// Get returns
router.get("/returns", authenticateCustomer, orderController.getReturns);

// Track order (public)
router.get("/track/:orderNumber", orderController.trackOrder);

module.exports = router;
