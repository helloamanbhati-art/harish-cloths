const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: String,
    productImage: String,
    brand: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    meters: Number,
    soldBy: {
      type: String,
      enum: ["meter", "piece"],
      required: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    // Order Number
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Customer Info
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null, // Guest checkout support
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,

    // Items
    items: {
      type: [orderItemSchema],
      required: [true, "Order must have items"],
      validate: [(items) => items.length > 0, "Order must have at least one item"],
    },

    // Pricing
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    // Discounts and Coupons
    couponCode: String,
    couponDiscount: { type: Number, default: 0, min: 0 },
    loyaltyPointsUsed: { type: Number, default: 0, min: 0 },

    // Shipping
    shippingAddress: {
      fullName: String,
      phone: String,
      houseName: String,
      building: String,
      street: String,
      landmark: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "overnight"],
      default: "standard",
    },
    trackingNumber: String,
    carrier: String, // e.g., "Shipway", "Easypost"

    // Billing
    billingAddress: {
      fullName: String,
      phone: String,
      houseName: String,
      building: String,
      street: String,
      landmark: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    sameAsShipping: { type: Boolean, default: true },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["razorpay", "upi", "card", "netbanking", "wallet"],
      default: "razorpay",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      transactionId: String,
      paidAmount: Number,
      paidAt: Date,
      failureReason: String,
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        updatedBy: mongoose.Schema.Types.ObjectId,
        notes: String,
      },
    ],

    // Return/Refund
    refundStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected", "processed"],
      default: "none",
    },
    refundAmount: { type: Number, default: 0, min: 0 },
    refundReason: String,
    refundRequestDate: Date,
    refundProcessedDate: Date,

    // Delivery
    deliveredAt: Date,
    estimatedDeliveryDate: Date,

    // Notes
    customerNotes: String,
    adminNotes: String,
    internalNotes: String,

    // Metadata
    source: {
      type: String,
      enum: ["web", "mobile", "api"],
      default: "web",
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre("save", async function (next) {
  if (!this.isModified("orderNumber") && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const dateStr = date
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    this.orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Index for faster queries
orderSchema.index({ customer: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Order", orderSchema);
