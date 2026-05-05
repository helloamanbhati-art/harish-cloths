const Order = require("../models/Order");
const PaymentTransaction = require("../models/PaymentTransaction");
const paymentService = require("../services/paymentService");
const emailService = require("../services/emailService");
const Customer = require("../models/Customer");

// Create Razorpay order
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("customer");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await paymentService.createRazorpayOrder({
      total: order.total,
      orderNumber: order.orderNumber,
      _id: order._id,
    });

    // Update order with Razorpay order ID
    order.paymentDetails.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify payment signature
    const verificationResult = await paymentService.verifyPayment({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    });

    if (!verificationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Update order payment status
    const order = await Order.findById(orderId).populate("customer");

    order.paymentStatus = "paid";
    order.paymentDetails.paymentStatus = "paid";
    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.transactionId = razorpayPaymentId;
    order.paymentDetails.paidAmount = order.total;
    order.paymentDetails.paidAt = new Date();

    // Change order status to confirmed
    if (order.status === "pending") {
      order.status = "confirmed";
      order.statusHistory.push({
        status: "confirmed",
        updatedAt: new Date(),
        notes: "Payment received",
      });
    }

    await order.save();

    // Record transaction
    await paymentService.recordPaymentTransaction({
      order: orderId,
      customer: order.customer._id,
      amount: order.total,
      currency: "INR",
      paymentMethod: "razorpay",
      transactionId: razorpayPaymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: "success",
      paymentGatewayResponse: verificationResult.payment,
    });

    // Send confirmation email
    if (order.customer && order.customer.email) {
      await emailService.sendPaymentReceivedEmail(order, order.customer);
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Handle payment failure
exports.handlePaymentFailure = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, failureReason } = req.body;

    const order = await Order.findById(orderId);

    if (order) {
      order.paymentStatus = "failed";
      order.paymentDetails.failureReason = failureReason;
      await order.save();

      // Record failed transaction
      await paymentService.recordPaymentTransaction({
        order: orderId,
        customer: order.customer,
        amount: order.total,
        currency: "INR",
        paymentMethod: "razorpay",
        razorpayOrderId,
        status: "failed",
        failureReason,
      });
    }

    res.json({
      success: true,
      message: "Payment failure recorded",
    });
  } catch (error) {
    next(error);
  }
};

// Request refund
exports.requestRefund = async (req, res, next) => {
  try {
    const { orderId, refundAmount, refundReason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Refund can only be processed for paid orders",
      });
    }

    order.refundStatus = "requested";
    order.refundAmount = refundAmount || order.total;
    order.refundReason = refundReason;
    order.refundRequestDate = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Refund request submitted",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Process refund (admin only)
exports.processRefund = async (req, res, next) => {
  try {
    const { orderId, refundAmount } = req.body;

    const order = await Order.findById(orderId);

    if (!order || !order.paymentDetails.razorpayPaymentId) {
      return res.status(404).json({
        success: false,
        message: "Order not found or payment not processed",
      });
    }

    // Process refund via Razorpay
    const refund = await paymentService.refundPayment(
      order.paymentDetails.razorpayPaymentId,
      refundAmount
    );

    order.refundStatus = "processed";
    order.refundProcessedDate = new Date();
    order.status = "refunded";
    order.statusHistory.push({
      status: "refunded",
      updatedAt: new Date(),
      notes: `Refund of ₹${refundAmount} processed`,
    });

    await order.save();

    // Record refund transaction
    await PaymentTransaction.create({
      order: orderId,
      amount: refundAmount,
      currency: "INR",
      paymentMethod: "razorpay",
      status: "refunded",
      refundId: refund.id,
      refundDate: new Date(),
    });

    res.json({
      success: true,
      message: "Refund processed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get payment transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const transactions = await PaymentTransaction.find({
      order: orderId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// Razorpay webhook
exports.handleRazorpayWebhook = async (req, res, next) => {
  try {
    const { event, payload } = req.body;

    // Verify webhook signature (implement this)
    // const signature = req.headers['x-razorpay-signature'];

    await paymentService.handleRazorpayWebhook({ event, payload });

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    next(error);
  }
};
