const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
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
      required: true,
    },

    // Return Items
    items: [
      {
        product: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        reason: String,
        condition: {
          type: String,
          enum: ["unused", "used", "damaged", "defective"],
        },
      },
    ],

    // Return Reason
    reason: {
      type: String,
      enum: [
        "wrong_item",
        "defective",
        "damaged",
        "not_as_described",
        "size_issue",
        "quality_issue",
        "changed_mind",
        "other",
      ],
      required: true,
    },
    detailedReason: String,

    // Status
    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "picked_up",
        "received",
        "inspected",
        "refunded",
        "cancelled",
      ],
      default: "requested",
    },

    // Refund
    refundAmount: Number,
    refundMethod: {
      type: String,
      enum: ["original_payment", "store_credit", "replacement"],
      default: "original_payment",
    },
    refundProcessedDate: Date,
    refundTransactionId: String,

    // Return Shipping
    returnShippingMethod: {
      type: String,
      enum: ["pickup", "dropoff", "courier"],
      default: "pickup",
    },
    returnTrackingNumber: String,
    returnCarrier: String,

    // Media
    photos: [String],

    // Notes
    customerNotes: String,
    adminNotes: String,
    inspectionNotes: String,

    // Dates
    requestedAt: { type: Date, default: Date.now },
    approvedAt: Date,
    pickupScheduledAt: Date,
    receivedAt: Date,
    inspectedAt: Date,
    refundCompletedAt: Date,

    // Admin
    approvedBy: mongoose.Schema.Types.ObjectId,
    inspectedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

// Indexes
returnSchema.index({ order: 1 });
returnSchema.index({ customer: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Return", returnSchema);
