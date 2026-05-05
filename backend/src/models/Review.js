const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    // Review Content
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Review content is required"],
    },

    // Rating
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    qualityRating: { type: Number, min: 1, max: 5 },
    valueForMoneyRating: { type: Number, min: 1, max: 5 },
    shippingRating: { type: Number, min: 1, max: 5 },

    // Review Media
    images: [String],
    videos: [String],

    // Review Status
    isApproved: { type: Boolean, default: false },
    isVerifiedPurchase: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },

    // Engagement
    helpfulCount: { type: Number, default: 0 },
    unhelpfulCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },

    // Admin
    approvedBy: mongoose.Schema.Types.ObjectId,
    approvedAt: Date,
    rejectReason: String,
  },
  { timestamps: true }
);

// Ensure one review per customer per product
reviewSchema.index({ product: 1, customer: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
