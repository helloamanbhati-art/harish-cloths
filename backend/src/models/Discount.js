const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    // Coupon/Discount Info
    code: {
      type: String,
      required: [true, "Discount code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping", "bogo"],
      required: true,
    },

    // Discount Value
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },
    maxDiscountAmount: Number, // For percentage discounts

    // Applicability
    applicableTo: {
      type: String,
      enum: ["all", "categories", "brands", "products"],
      default: "all",
    },
    categories: [mongoose.Schema.Types.ObjectId],
    brands: [mongoose.Schema.Types.ObjectId],
    products: [mongoose.Schema.Types.ObjectId],

    // Usage Limits
    minPurchaseAmount: { type: Number, default: 0 },
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    maxUsesPerCustomer: { type: Number, default: 1 },

    // Validity
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Target Audience
    applicableToCustomers: {
      type: String,
      enum: ["all", "new", "loyal", "specific"],
      default: "all",
    },
    specificCustomers: [mongoose.Schema.Types.ObjectId],

    // Stacking
    canStackWithOtherCoupons: { type: Boolean, default: false },

    // Admin
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

// Indexes
discountSchema.index({ startDate: 1, endDate: 1 });
discountSchema.index({ isActive: 1 });

module.exports = mongoose.model("Discount", discountSchema);
