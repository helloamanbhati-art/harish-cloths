const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },

    // Stock Levels
    available: { type: Number, default: 0, min: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    damaged: { type: Number, default: 0, min: 0 },
    returned: { type: Number, default: 0, min: 0 },

    // Tracking
    lastStockCheckDate: Date,
    lowStockThreshold: { type: Number, default: 10 },
    reorderPoint: { type: Number, default: 5 },
    reorderQuantity: { type: Number, default: 50 },
    lastReorderedDate: Date,

    // Movement History
    stockHistory: [
      {
        type: {
          type: String,
          enum: ["purchase", "sale", "return", "adjustment", "damage", "restock"],
        },
        quantity: Number,
        reference: String, // Order ID, Return ID, etc.
        notes: String,
        createdAt: { type: Date, default: Date.now },
        createdBy: mongoose.Schema.Types.ObjectId,
      },
    ],

    // Warehouse/Location (for multi-warehouse support)
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
  },
  { timestamps: true }
);

// Indexes
inventorySchema.index({ product: 1 });
inventorySchema.index({ lowStockThreshold: 1 });
inventorySchema.index({ warehouse: 1 });

module.exports = mongoose.model("Inventory", inventorySchema);
