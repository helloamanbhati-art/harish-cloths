const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    recipient: {
      type: {
        type: String,
        enum: ["customer", "admin"],
      },
      id: mongoose.Schema.Types.ObjectId,
    },

    // Notification Content
    type: {
      type: String,
      enum: [
        "order_confirmed",
        "order_shipped",
        "order_delivered",
        "payment_received",
        "payment_failed",
        "return_approved",
        "return_refunded",
        "review_approved",
        "low_stock",
        "custom",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed, // Additional data like order ID, product ID, etc.

    // Channels
    channels: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },

    // Status
    isRead: { type: Boolean, default: false },
    readAt: Date,
    isSent: { type: Boolean, default: false },
    sentAt: Date,

    // Delivery Status
    deliveryStatus: {
      email: {
        type: String,
        enum: ["pending", "sent", "failed", "not_applicable"],
        default: "not_applicable",
      },
      sms: {
        type: String,
        enum: ["pending", "sent", "failed", "not_applicable"],
        default: "not_applicable",
      },
      push: {
        type: String,
        enum: ["pending", "sent", "failed", "not_applicable"],
        default: "not_applicable",
      },
    },

    // Links
    actionUrl: String,
    actionLabel: String,

    // Priority
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    // Expiry
    expiresAt: Date,
  },
  { timestamps: true }
);

// Index for querying unread notifications
notificationSchema.index({ "recipient.id": 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
