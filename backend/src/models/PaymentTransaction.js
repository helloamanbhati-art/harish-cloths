const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema(
  {
    // References
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    // Payment Info
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "upi", "card", "netbanking", "wallet", "cod"],
      required: true,
    },

    // Transaction Details
    transactionId: String,
    referenceNumber: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    // Status
    status: {
      type: String,
      enum: ["pending", "initiated", "success", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    // Response Data
    paymentGatewayResponse: mongoose.Schema.Types.Mixed,
    failureReason: String,
    failureCode: String,

    // Refund Info
    refundAmount: { type: Number, default: 0 },
    refundStatus: {
      type: String,
      enum: ["none", "partial", "full"],
      default: "none",
    },
    refundId: String,
    refundDate: Date,

    // Metadata
    ipAddress: String,
    userAgent: String,
    vpa: String, // For UPI
    cardLast4: String, // For cards
  },
  { timestamps: true }
);

// Indexes
paymentTransactionSchema.index({ order: 1 });
paymentTransactionSchema.index({ transactionId: 1 });
paymentTransactionSchema.index({ status: 1 });
paymentTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("PaymentTransaction", paymentTransactionSchema);
