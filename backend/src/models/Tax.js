const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    // Tax Rules
    name: {
      type: String,
      required: [true, "Tax name is required"],
    },
    rate: {
      type: Number,
      required: [true, "Tax rate is required"],
      min: 0,
      max: 100,
    },

    // Applicability
    countries: [String], // e.g., ["IN"]
    states: [String], // e.g., ["MH", "KA"]
    cities: [String],

    // Category Based
    categories: [mongoose.Schema.Types.ObjectId],
    products: [mongoose.Schema.Types.ObjectId],

    // Tax Type
    taxType: {
      type: String,
      enum: ["gst", "sales_tax", "vat", "custom"],
      required: true,
    },

    // Slab (for progressive tax)
    isSlab: { type: Boolean, default: false },
    slabs: [
      {
        minAmount: Number,
        maxAmount: Number,
        rate: Number,
      },
    ],

    // Status
    isActive: { type: Boolean, default: true },

    // Metadata
    description: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

// Indexes
taxSchema.index({ countries: 1, states: 1 });
taxSchema.index({ taxType: 1 });
taxSchema.index({ isActive: 1 });

module.exports = mongoose.model("Tax", taxSchema);
